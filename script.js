const api = {
  base: "https://api.themoviedb.org/3",
  apiKey: "api_key=299617aaca47b71060926ec16660e3d7",
  searchPage: "page=",
  endPoints: {
    movie: `/movie/${this.searchId}`,
    movieDiscover: "/discover/movie",
    genre: "/genre/movie/list",
    movieCredits(id) {
      return `/movie/${id}/credits`;
    },
  },
  async requestApi(url) {
    const result = await axios.get(url).then((res) => res.data);
    return result;
  },
  async getAllGenreMovies() {
    const url = `${this.base}${this.endPoints.genre}?${this.apiKey}`;
    const results = await this.requestApi(url);
    return results.genres;
  },
  async getCreditMovie(movie) {
    const url = `${this.base}${this.endPoints.movieCredits(movie.id)}?${
      this.apiKey
    }`;

    const result = await this.requestApi(url);

    return result;
  },
  async searchGenreMovie(genresArray) {
    const allGenres = await this.getAllGenreMovies();
    const results = genresArray.map((e) =>
      allGenres.find((e2) => e === e2.name)
    );

    const movies = await this.generateMovies(allGenres, results, 5);

    return movies;
  },
  async convertGenreIdByObject(genreArray) {
    const allGenres = await this.getAllGenreMovies();
    const results = genreArray.map((e) => allGenres.find((e2) => e === e2.id));

    return results;
  },
  async getRandomMovie() {
    const rand = RandomNumber(0, 500);
    const pageKey = `${this.searchPage}${rand}`;
    const url = `${this.base}${this.endPoints.movieDiscover}?${this.apiKey}&${pageKey}`;
    const data = await this.requestApi(url);
    const movie = getMovie(data.results);
    const credits = await this.getCreditMovie(movie);

    movie.genre_ids = await this.convertGenreIdByObject(movie.genre_ids);
    movie.credits = credits;

    function getMovie(data) {
      const rand = Math.round(RandomNumber(0, data.length - 1));
      const result = data[rand];
      return result;
    }

    return movie;
  },
  async generateMovies(allGenres, genresArray, numMovies) {
    const url = [];
    url.push(
      ...genresArray.map((e) => {
        const rand = RandomNumber(0, 500);
        const pageKey = `${this.searchPage}${rand}`;
        return `${this.base}${this.endPoints.movieDiscover}?${this.apiKey}&with_genres=${e.id}&${pageKey}`;
      })
    );
    const data = [];

    for (let i = 0; i < url.length; i++) {
      const result = await this.requestApi(url[i]);
      data.push(result);
      genresArray[i].movies = [];
      data[i].results.map(async (movie, index) => {
        index < numMovies
          ? ((movie.credits = await this.getCreditMovie(movie)),
            genresArray[i].movies.push(searchGenre(movie)))
          : null;
      });
    }

    function searchGenre(movie) {
      const genres = [];
      movie.genre_ids.map((catalogGenre) => {
        const genre = allGenres.find((genre) => genre.id === catalogGenre);
        const { id, name } = genre;
        genres.push({ id: id, name: name });
      });
      movie.genre_ids = genres;
      return movie;
    }

    return await genresArray;
  },
};

function RandomNumber(min = 0, max = 1) {
  return Number((Math.random() * (max - min) + min).toFixed(1));
}

async function main(api) {
  function Catalog(genres) {
    this.genres = genres;
  }
  Catalog.prototype.showConsole = function () {
    console.log(this);
  };

  function Person(name, surname, birthDate, favoriteMovie) {
    this.name = name;
    this.surname = surname;
    this.birthDate = birthDate;
    this.favoriteMovie = new Movie(favoriteMovie);
    this.dialog = {
      firstImpressions: {
        first_answer: [
          "Yeah, I watched.",
          "Of course!",
          "Sure!",
          "Indeed.",
          "Absolutely!",
          "No doubt.",
        ],
        second_answer: [
          "This movie is",
          "In my opinion the movie was",
          "From what I've seen, the movie was",
          "So... I think the movie was",
          "You know... I think it was",
          "Hmm... I think the movie was",
          "I think it was",
          "The movie was",
        ],
        comparative_degree: {
          quality: {
            good: ["the best"],
            bad: ["the worst"],
          },
        },
        objects: [
          "of all time",
          "in the world",
          "of the decade",
          "ever",
          "I've ever seen",
        ],
        adverbs: {
          intesity: {
            intense: [
              "very",
              "extremely",
              "immensely",
              "too",
              "quite",
              "really",
            ],
            none: [""],
          },
        },
        adjetives: {
          quality: {
            very_good: {
              action: ["incredible", "exciting"],
              adventure: ["exciting", "amazing"],
              animation: ["beautiful", "pretty", "handsome", "creative"],
              comedy: ["funny", "cool"],
              crime: ["violent", "realistic"],
              documentary: ["organized"],
              drama: ["amazing", "apprehensive"],
              family: ["cool", "realistic", "organized"],
              fantasy: ["creative", "mythical"],
              history: ["organized", "inspiring"],
              horror: ["scary", "frightful", "fearful"],
              music: ["exciting", "inspiring"],
              mystery: ["distressing", "nervous", "apprehensive"],
              romance: ["romantic", "exciting"],
              science_fiction: ["creative", "realistic"],
              tv_movie: ["cool", "breathtaking"],
              thriller: ["exciting", "nervous"],
              war: ["incredible", "violent", "realistic"],
              western: ["violent", "amazing"],
              others: [
                "unbelievable",
                "phenomenal",
                "fantastic",
                "breathtaking",
                "awesome",
                "fabulous",
                "spectacular",
              ],
            },
            good: [
              "good",
              "nice",
              "worth",
              "interesting",
              "enjoyable",
              "lovely",
              "great",
            ],

            neutral: [
              "middling",
              "moderate",
              "indifferent",
              "tolerable",
              "OK",
              "so-so",
            ],
            bad: [
              "bad",
              "not enough",
              "poor",
              "unsatisfactory",
              "pathetic",
              "annoying",
            ],
            very_bad: [
              "terrible",
              "awfull",
              "horrible",
              "hateful",
              "unsightly",
            ],
          },
        },

        subject: ["It's", "It's one of"],
        rating: [
          "My grade is",
          "My rating is",
          "I think it would give",
          "I'm rating",
          "This movie deserves a",
        ],
      },
    };
  }

  function Interviewer(name, surname, birthDate) {
    this.name = name;
    this.surname = surname;
    this.birthDate = birthDate;
    this.dialog = {
      greeting: ["Hello there!", "Hello!", "Hi!", "Hello everyone!"],
      presentation: [
        "I'm here with",
        "I speak today with",
        "By my side is",
        "Today we'll talk to",
      ],
      presentationObject: [
        "to hear his opinion about the movies in the catalog.",
        "who has seen the movies in the catalogue, and will give his opinion.",
      ],
      firstMovie: ["The first movie is", "Let's start with the movie"],
      nextMovie: [
        "The next film in the catalog is",
        "Now let's talk about the movie",
      ],
      firstQuestion: [
        "Did you watch it?",
        "Have you watched it?",
        "Have you viewed the movie?",
        "Have you seen the movie?",
        "Did you view it?",
      ],
      secondQuestion: [
        "What did you think about it?",
        "So, did you like it?",
        "So, what is your opinion about it?",
        "What do you have to say about it?",
        "Tell me, what did you think?",
      ],
    };
  }

  Interviewer.prototype.interview = function (
    catalogMovie,
    index,
    questionType
  ) {
    let randomIndex = (min, max) => RandomNumber(min, max).toFixed(0);
    const dialog = this.dialog;
    switch (questionType) {
      case "presentation":
        givePresentation();
        break;
      case "presentationAllMovies":
        givePresentationAllMovies();
        break;
      case "firstQuestion":
        askFirstQuestion(index);
        break;
      case "secondQuestion":
        askSecondQuestion();
        break;
      default:
        break;
    }

    function givePresentation() {
      const greeting = dialog.greeting;
      const presentationSubject = dialog.presentation;
      const presentationObject = dialog.presentationObject;
      const presentation = getPresentation();

      function getPresentation() {
        return `${greeting[randomIndex(0, greeting.length - 1)]} ${
          presentationSubject[randomIndex(0, presentationSubject.length - 1)]
        } ${person.name} ${
          presentationObject[randomIndex(0, presentationObject.length - 1)]
        }`;
      }

      console.log(`${interviewer.name}: ${presentation}`);
    }

    function givePresentationAllMovies() {
      const titles = person.feedbackCatalogMovies.map(
        (movie) => movie.movie.title
      );

      console.log("These are the movies in the catalog:");
      titles.map((title, index) => {
        console.log(`Movie ${index + 1}: ${title}`);
      });
    }

    function askFirstQuestion(index) {
      const firstQuestion =
        dialog.firstQuestion[randomIndex(0, dialog.firstQuestion.length - 1)];
      const askMovie =
        index === 0
          ? dialog.firstMovie[randomIndex(0, dialog.firstMovie.length - 1)]
          : dialog.nextMovie[randomIndex(0, dialog.firstMovie.length - 1)];
      console.log(`${interviewer.name}: ${askMovie}: ${catalogMovie.title}`);
      console.log("");
      console.log(`${interviewer.name}: ${firstQuestion}`);
    }

    function askSecondQuestion() {
      const secondQuestion =
        dialog.secondQuestion[randomIndex(0, dialog.secondQuestion.length - 1)];
      console.log(`${interviewer.name}: ${secondQuestion}`);
    }
  };

  Person.prototype.showConsole = function () {
    console.log(this);
  };

  Person.prototype.interview = function (catalogMovie, questionType) {
    let randomIndex = (min, max) => RandomNumber(min, max).toFixed(0);
    const firstImpressions = this.dialog.firstImpressions;
    const getMovie = () => {
      let feedbackMovie;
      for (feedback of this.feedbackCatalogMovies) {
        if (catalogMovie.id === feedback.movie.id) {
          feedbackMovie = feedback;
          break;
        }
      }
      return feedbackMovie;
    };

    const feedbackMovie = getMovie();

    switch (questionType) {
      case "firstQuestion":
        giveFirstAnswer();
        break;
      case "secondQuestion":
        giveSecondAnswer(feedbackMovie);
        break;
      case "note":
        giveNote(feedbackMovie);
        break;
      default:
        break;
    }

    function giveFirstAnswer() {
      const firstAnswer =
        firstImpressions.first_answer[
          randomIndex(0, firstImpressions.first_answer.length - 1)
        ];

      console.log(`${person.name}: ${firstAnswer}`);
    }

    function giveSecondAnswer(feedbackMovie) {
      const rate = feedbackMovie.rate;

      const secondAnswer =
        firstImpressions.second_answer[
          randomIndex(0, firstImpressions.second_answer.length - 1)
        ];
      const adverb = getAdverb(firstImpressions.adverbs, "intensity");
      const adjective = getAdjective(firstImpressions.adjetives, "quality");
      const adverbialAdject = getAdverbialAdject();
      const subject = getSubject(firstImpressions.subject);
      const comparativeDegree = getComparativeDegree(
        firstImpressions.comparative_degree,
        "quality"
      );
      const object = getObject(firstImpressions.objects);
      const predicate = getPredicate();
      const feedbackRate = getFeedbackRate(firstImpressions.rating);

      function getAdverbialAdject() {
        let result;

        adverb !== ""
          ? (result = adverb + " " + adjective)
          : (result = adjective);

        return result;
      }

      function getPredicate() {
        let result;

        switch (true) {
          case rate >= 8 || rate <= 2:
            result = subject + " " + comparativeDegree + " movie " + object;
            break;
          default:
            result = "";
            break;
        }

        return result;
      }

      function getAdjective(object, type) {
        let adjective = object;
        type === "quality" && (adjective = object.quality);

        switch (true) {
          case 0 <= rate && rate <= 2:
            return adjective.very_bad[
              randomIndex(0, adjective.very_bad.length - 1)
            ];
          case 2 < rate && rate <= 5:
            return adjective.bad[randomIndex(0, adjective.bad.length - 1)];
          case 5 < rate && rate < 7:
            return adjective.neutral[
              randomIndex(0, adjective.neutral.length - 1)
            ];
          case 7 <= rate && rate <= 8.5:
            return adjective.good[randomIndex(0, adjective.good.length - 1)];
          case 8.5 < rate && rate <= 10:
            return adjective.very_good.others[
              randomIndex(0, adjective.very_good.others.length - 1)
            ];
          default:
            return "error";
        }
      }

      function getAdverb(object, type) {
        let adverb = object;
        type === "intensity" && (adverb = object.intesity);
        switch (true) {
          case (0 <= rate && rate <= 2) || (8 <= rate && rate <= 10):
            return adverb.intense[randomIndex(0, adverb.intense.length - 1)];
          case 2 < rate < 8:
            return adverb.none[0];
          default:
            return "error";
        }
      }

      function getSubject(object) {
        return object[randomIndex(0, object.length - 1)];
      }
      function getObject(object) {
        return object[randomIndex(0, object.length - 1)];
      }
      function getComparativeDegree(object, type) {
        type === "quality" && (object = object.quality);
        switch (true) {
          case rate > 5:
            return object.good[randomIndex(0, object.good.length - 1)];
          case rate <= 5:
            return object.bad[randomIndex(0, object.bad.length - 1)];
          default:
            break;
        }
      }
      function getFeedbackRate(rating) {
        return `${rating[randomIndex(0, rating.length - 1)]} ${rate}.`;
      }

      console.log(
        `${person.name}: ${secondAnswer} ${adverbialAdject}. ${predicate}`
      );
      console.log(`${person.name}: ${feedbackRate}`);
    }

    function giveNote(feedbackMovie) {}
  };

  Person.prototype.feedbackMovies = function (catalog) {
    const catalogMovies = getMoviesFromCatalog(catalog);

    this.feedbackCatalogMovies = getFeedback(this.favoriteMovie, catalogMovies);

    function getMoviesFromCatalog(catalog) {
      const movies = [];

      catalog.genres.map((genre) =>
        genre.movies.map((movie) => {
          movies.push({
            id: movie.id,
            title: movie.title,
            genres: movie.genre_ids,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            credits: movie.credits,
          });
        })
      );

      return movies;
    }

    function getFeedback(personFavoriteMovie, catalogMovies) {
      let rating = [];

      catalogMovies.map((catalogMovie) => {
        const comment = calculateRating(catalogMovie);
        rating.push({
          movie: catalogMovie,
          rate: comment.rate,
          note: comment.note,
        });
      });

      function calculateRating(catalogMovie) {
        const note = [];
        const genreRate = ratingByGenre(catalogMovie);
        const creditsRate = ratingByCredits(catalogMovie);
        const releaseRate = ratingByReleaseDate(catalogMovie);
        let rate = getAverageRate(genreRate, creditsRate, releaseRate);

        function getAverageRate(genreRate, creditsRate, releaseRate) {
          const incrementRate = genreRate + creditsRate + releaseRate;
          const voteAverage = catalogMovie.vote_average;
          const voteCount = catalogMovie.vote_count;

          let rate =
            voteAverage !== 0 && voteCount >= 2
              ? RandomNumber(voteAverage - 0.5, voteAverage + 0.5)
              : RandomNumber(6, 6.7);
          rate += incrementRate;

          const difference =
            voteAverage - rate < 0
              ? (voteAverage - rate) * -1
              : voteAverage - rate;
          difference >= 2.5 ? (rate = (voteAverage + rate) / 2) : null;

          return Number(rate.toFixed(1));
        }

        function ratingByGenre(catalogMovie) {
          let rate = 0;
          const catalogGenres = catalogMovie.genres;
          const personGenres = personFavoriteMovie.genre;

          personGenres.map((personGenre) => {
            catalogGenres.map((catalogGenre) =>
              personGenre.id === catalogGenre.id
                ? ((rate += 0.75),
                  note.push({
                    id: personGenre.id,
                    genre: personGenre.name,
                  }))
                : null
            );
          });

          return rate;
        }

        function ratingByCredits(catalogMovie) {
          let rate = 0;
          const catalogCredits = catalogMovie.credits;
          const personCredits = personFavoriteMovie.credits;

          ratingByCast(personCredits.cast, catalogCredits.cast);
          ratingByCrew(personCredits.crew, catalogCredits.crew);

          function ratingByCast(personCast, catalogCast) {
            personCast.map((personActor) => {
              catalogCast.map((catalogActor) => {
                personActor.id === catalogActor.id
                  ? ((rate += 2),
                    note.push({
                      id: personActor.id,
                      name: personActor.name,
                      occupation: personActor.known_for_department,
                    }))
                  : null;
              });
            });
          }

          function ratingByCrew(personCrew, catalogCrew) {
            personCrew.map((personWorker) => {
              catalogCrew.map((catalogWorker) => {
                personWorker.id === catalogWorker.id
                  ? ((rate += 1),
                    note.push({
                      id: personWorker.id,
                      name: personWorker.name,
                      occupation: personWorker.known_for_department,
                    }))
                  : null;
              });
            });
          }

          return rate;
        }

        function ratingByReleaseDate(catalogMovie) {
          let isCatalogReleaseUndefined = false;
          let isPersonReleaseUndefined = false;
          const catalogReleaseYear =
            catalogMovie.release_date !== undefined
              ? catalogMovie.release_date.slice(0, 4)
              : (isCatalogReleaseUndefined = true);
          const personReleaseYear =
            personFavoriteMovie.release_date !== undefined
              ? personFavoriteMovie.release_date.slice(0, 4)
              : (isPersonReleaseUndefined = true);
          let yearDifference = catalogReleaseYear - personReleaseYear;

          yearDifference < 0 ? (yearDifference = yearDifference * -1) : null;

          const result =
            !isCatalogReleaseUndefined || !isPersonReleaseUndefined
              ? calculateYear(yearDifference)
              : 0;

          function calculateYear(yearDifference) {
            let value;

            function getEquationResult(decade) {
              let value = (10 / decade - (yearDifference - decade) / 2) / 10;
              let vetor = value < 0 ? value * -1 : value;

              vetor > 2.5 ? (vetor = 2.5) : null;

              value < 0 ? (value = vetor * -1) : null;

              return value;
            }
            switch (true) {
              case yearDifference <= 10:
                value = getEquationResult(10);
                break;
              case 10 < yearDifference <= 20:
                value = getEquationResult(20);
                break;
              case 20 < yearDifference <= 30:
                value = getEquationResult(30);
                break;
              case 30 < yearDifference <= 40:
                value = getEquationResult(40);
                break;
              case 40 < yearDifference <= 50:
                value = getEquationResult(50);
                break;
              default:
                value = getEquationResult(60);
                break;
            }

            return value;
          }

          return result;
        }

        return { rate, note };
      }

      return rating;
    }

    return this.feedbackMovies;
  };

  function Movie(data) {
    this.title = data.title;
    this.release_date = data.release_date;
    this.genre = data.genre_ids;
    this.credits = data.credits;
  }

  Movie.prototype.showConsole = function () {
    console.log(this);
  };

  function getInterview(person, interviewer) {
    interviewer.interview(catalog, null, "presentation");
    console.log("");
    interviewer.interview(catalog, null, "presentationAllMovies");
    console.log("");
    console.log("");
    catalog.genres.map((genre) => {
      genre.movies.map((catalogMovie, index) => {
        interviewer.interview(catalogMovie, index, "firstQuestion");
        person.interview(catalogMovie, "firstQuestion");
        interviewer.interview(catalogMovie, index, "secondQuestion");
        person.interview(catalogMovie, "secondQuestion");
        console.log("");
        console.log("");
      });
    });
  }

  const catalog = new Catalog(
    await api.searchGenreMovie(["Comedy", "Action", "Fantasy"])
  );

  const person = new Person(
    "Rian",
    "Fiore",
    "1999-11-24",
    await api.getRandomMovie()
  );
  const interviewer = new Interviewer("Roger", "Souza", "2001-10-12");
  person.feedbackMovies(catalog);
  getInterview(person, interviewer);
}
main(api);
