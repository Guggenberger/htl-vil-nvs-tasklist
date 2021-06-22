import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';

import User from '../users/user-model.js';
import getData from './json-reader.js';

import { healthCheck } from './00-test-suite-hook.js';

const { expect } = chai;

const entityEndpoint = '/api/v1/users';
const authInfo = {"username": "Debbie@chat.app", "password": "12345"};
let authorizationId = '';
const userTestdataFile = './tests/user-mock-data-crud-tests.json';

const foundId = '5fce46cc305c2d245480a74d';
const notFoundId = '5ace46cc305c2d245480a74d';
const toDeleteId = '5fce46cc15bc32f1ecf33861';
const updateId = '5fce46ccf4f27b02c72f5489';

const userToCreate = {
  username: 'user1@htl-villach.at',
  password: '1234',
  age: 25,
  gender: 'female',
  lastname: 'Boyle',
  firstname: 'Katlynn',
  state: 'online',
};

const generatedUserUrls = [];

chai.use(chaiHttp);
chai.should();

let cnt = 0;

// hook - done() fires, if healthcheck point answers with 200
before(() => {
  return healthCheck(app);
});

describe(`CRUD Tests for ${entityEndpoint}`, () => {
  it(`2000 Create TESTDATA for ${entityEndpoint} with file "${userTestdataFile}"`, async () => {
    let allUsers = await getData(userTestdataFile);

    let creationJobs = allUsers.map((u) => {
      let user = new User(u);
      //console.log(`testuser created: ${u.username}`);
      return user.save();
    });

    return Promise.all(creationJobs);
  });

  it('LOGIN', (done) => {
    chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(authInfo)
        .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            authorizationId = res.body;
            done();
        });
  });

  let testGroupName = 'GET ALL';
  let testNr = 2000;
  describe(testGroupName, () => {
    it(`${testNr++} ${testGroupName} - No Auth. header - 401`, (done) => {
      chai
        .request(app)
        .get(entityEndpoint)
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(401);
          done();
        });
    });

    it(`${testNr++} ${testGroupName} - 200`, (done) => {
      testNr = 2002;
      chai
        .request(app)
        .get(entityEndpoint)
        .set('Authorization', authorizationId)
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          res.body.should.be.a('array');
          expect(res.body.length).to.equal(13);
          expect(res.body[0]._id).to.equal(foundId);
          done();
        });
    });
  });

  testGroupName = 'GET SINGLE';
  describe(testGroupName, () => {
    it(`${testNr++} ${testGroupName} - 200`, (done) => {
      chai
        .request(app)
        .get(entityEndpoint + '/' + foundId)
        .set('Authorization', authorizationId)
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(res.body).length.should.eql(8);

          res.body.should.have.property('_id');
          expect(res.body._id).to.equal(foundId);

          done();
        });
    });

    it(`${testNr++} ${testGroupName} - No Auth. header - 401`, (done) => {
      chai
        .request(app)
        .get(entityEndpoint + '/' + foundId)
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(401);
          done();
        });
    });

    it(`${testNr++} ${testGroupName} - invalid ObjectId - 400`, (done) => {
      chai
        .request(app)
        .get(entityEndpoint + '/abc')
        .set('Authorization', authorizationId)
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(400);
          done();
        });
    });

    it(`${testNr++} ${testGroupName} - 404`, (done) => {
      chai
        .request(app)
        .get(entityEndpoint + '/' + notFoundId)
        .set('Authorization', authorizationId)
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(404);
          done();
        });
    });
  });

  testGroupName = 'DELETE';
  describe(testGroupName, () => {
      it(`${testNr++} ${testGroupName} - No Auth. header - 401`, done => {
          chai
              .request(app)
              .delete(entityEndpoint + '/' + toDeleteId)
              .end((err, res) => {
                  expect(err).to.be.null;
                  res.should.have.status(401);
                  done();
              });
      });

      it(`${testNr++} ${testGroupName} - invalid ObjectId - 400`, done => {
          chai
              .request(app)
              .delete(entityEndpoint + '/abc')
              .set('Authorization', authorizationId)
              .end((err, res) => {
                  expect(err).to.be.null;
                  res.should.have.status(400);
                  done();
              });
      });

      it(`${testNr++} ${testGroupName} - 404`, done => {
          chai
              .request(app)
              .delete(entityEndpoint + '/' + notFoundId)
              .set('Authorization', authorizationId)
              .end((err, res) => {
                  expect(err).to.be.null;
                  res.should.have.status(404);
                  done();
              });
      });

      it(`${testNr++} ${testGroupName} - 204`, done => {
          chai
              .request(app)
              .delete(entityEndpoint + '/' + toDeleteId)
              .set('Authorization', authorizationId)
              .end((err, res) => {
                  expect(err).to.be.null;
                  res.should.have.status(204);
                  done();
              });
      });

      it(`${testNr++} ${testGroupName} - 200`, done => {
          chai
              .request(app)
              .get(entityEndpoint)
              .set('Authorization', authorizationId)
              .end((err, res) => {
                  expect(err).to.be.null;
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.eql(12);
                  done();
              });
      });

      it(`${testNr++} ${testGroupName} - check delete - 404`, done => {
          chai
              .request(app)
              .get(entityEndpoint + '/' + toDeleteId)
              .set('Authorization', authorizationId)
              .end((err, res) => {
                  expect(err).to.be.null;
                  res.should.have.status(404);
                  done();
              });
      });
  });

  testGroupName = 'POST';
    describe(testGroupName, () => {
        describe('check basic test cases ', () => {
            it(`${testNr++} ${testGroupName} - No Auth. header - 401`, done => {
                chai
                    .request(app)
                    .post(entityEndpoint)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(401);
                        done();
                    });
            });

            it(`${testNr++} ${testGroupName} - Create user - 201`, done => {
                chai
                    .request(app)
                    .post(entityEndpoint)
                    .send(userToCreate)
                    .set('Authorization', authorizationId)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('url').not.to.be.null;
                        generatedUserUrls.push(res.body.url);
                        done();
                    });
            });

            it(`${testNr++} ${testGroupName} - GET created user - 200 `, done => {
                chai
                    .request(app)
                    .get(entityEndpoint + "/" +generatedUserUrls[0])
                    .set('Authorization', authorizationId)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(200);
                        done();
                    });
            });
        });

        /* --------------------- property tests --------------------- */

        /* --------------------------- username -------------------------- */
        describe('check property username ', () => {
            let wrongUsers = [];

            let u = { ...userToCreate };
            u.username = {};
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.username = "";
            wrongUsers.push(u);

            u = { ...userToCreate };
            delete u.username;
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.username = "Fr@anz@";
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.username = "F@r";
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.username = "F@ssssssssdadsjkfhjsdakjfhkjsdahfkjhsdakjfr";
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.username = "F@ sss@ sss ssda";
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.username = "Franz";
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - Username - 400`, done => {
                    chai
                        .request(app)
                        .post(entityEndpoint)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* ----------------------------- password -------------------------- */
        describe('check property password ', () => {
            let wrongUsers = [];
            let u = { ...userToCreate };
            u.password = "";
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.password = [];
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - Password - 400`, done => {
                    chai
                        .request(app)
                        .post(entityEndpoint)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------------- age -------------------------- */
        describe('check property age ', () => {
            let wrongUsers = [];
            let u = { ...userToCreate };
            u.age = "Franz";
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.age = 5;
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.age = 121;
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - Age - 400`, done => {
                    chai
                        .request(app)
                        .post(entityEndpoint)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------------- state -------------------------- */
        describe('check property state ', () => {
            let wrongUsers = [];
            let u = { ...userToCreate };
            u.state = "Franz";
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.state = {};
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.state = "";
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - State - 400`, done => {
                    chai
                        .request(app)
                        .post(entityEndpoint)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------------- firstname -------------------------- */
        describe('check property firstname ', () => {
            let wrongUsers = [];
            let u = { ...userToCreate };
            u.firstname = "";
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.lastname = {};
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - Firstname - 400`, done => {
                    chai
                        .request(app)
                        .post(entityEndpoint)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------------- lastname -------------------------- */
        describe('check property lastname ', () => {
            let wrongUsers = [];
            let u = { ...userToCreate };
            u.lastname = "";
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.lastname = {};
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - Lastname - 400`, done => {
                    chai
                        .request(app)
                        .post(entityEndpoint)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------------- gender -------------------------- */
        describe('check property gender ', () => {
            let wrongUsers = [];
            let u = { ...userToCreate };
            u.gender = "Franz";
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.gender = {};
            wrongUsers.push(u);

            u = { ...userToCreate };
            u.gender = "";
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - Gender - 400`, done => {
                    chai
                        .request(app)
                        .post(entityEndpoint)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------- missing / wrong props ------------------- */
        describe('check missing / wrong props ', () => {
            let wrongUsers = [];
            let u = { ...userToCreate };
            delete u.state;
            wrongUsers.push(u);

            u = { ...userToCreate };
            delete u.gender;
            wrongUsers.push(u);

            u = { ...userToCreate };
            delete u.lastname;
            wrongUsers.push(u);

            u = { ...userToCreate };
            delete u.username;
            wrongUsers.push(u);

            u = { ...userToCreate };
            delete u.password;
            wrongUsers.push(u);

            u = { ...userToCreate };
            delete u.password;
            u['wrongprop'] = 'hihi;'
            wrongUsers.push(u);


            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - missing prop(s) - 400`, done => {
                    chai
                        .request(app)
                        .post(entityEndpoint)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------- successful creates ----------------------- */
        describe('check successful creates ', () => {
            it(`${testNr++} ${testGroupName} - Create user with crazy name - 201`, done => {
                let u = { ...userToCreate };
                u.username = "  @  ";
                chai
                    .request(app)
                    .post(entityEndpoint)
                    .send(u)
                    .set('Authorization', authorizationId)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('url').not.to.be.null;
                        let completeUrl = res.body.url;
                        let baseUrl = completeUrl.split(app.hostname)[1];
                        generatedUserUrls.push(baseUrl);
                        done();
                    });
            });

            it(`${testNr++} ${testGroupName} - Create user without firstname - 201`, done => {
                let u = { ...userToCreate };
                u.username = 'with@out.at';
                delete u.firstname;
                chai
                    .request(app)
                    .post(entityEndpoint)
                    .send(u)
                    .set('Authorization', authorizationId)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('url').not.to.be.null;
                        let completeUrl = res.body.url;
                        let baseUrl = completeUrl.split(app.hostname)[1];
                        generatedUserUrls.push(baseUrl);
                        done();
                    });
            });
        });

        /* --------------------- special fails  ----------------------- */
        describe('check special fails ', () => {
            it(`${testNr++} ${testGroupName} - Create user duplicate - 400`, done => {
                chai
                    .request(app)
                    .post(entityEndpoint)
                    .send(userToCreate)
                    .set('Authorization', authorizationId)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(400);
                        done();
                    });
            });


            it(`${testNr++} ${testGroupName} - Create user with id - 400`, done => {
                let u = { ...userToCreate };
                u._id = "5ece87cc87843db743cea878";
                chai
                    .request(app)
                    .post(entityEndpoint)
                    .send(u)
                    .set('Authorization', authorizationId)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(400);
                        done();
                    });
            });

            it(`${testNr++} ${testGroupName} - Create user lastname problem1 - 400`, done => {
                let u = { ...userToCreate };
                u.username = "lastname@Problem";
                u.lastname = "";
                chai
                    .request(app)
                    .post(entityEndpoint)
                    .send(u)
                    .set('Authorization', authorizationId)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(400);
                        done();
                    });
            });

            it(`${testNr++} ${testGroupName} - Create user lastname problem2 - 400`, done => {
                let u = { ...userToCreate };
                u.username = "lastname@Problem";
                u.lastname = [];
                chai
                    .request(app)
                    .post(entityEndpoint)
                    .send(u)
                    .set('Authorization', authorizationId)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(400);
                        done();
                    });
            });

            it(`${testNr++} ${testGroupName} - Create user firstname problem - 400`, done => {
                let u = { ...userToCreate };
                u.username = "firstname@Problem";
                u.firstname = [];
                chai
                    .request(app)
                    .post(entityEndpoint)
                    .send(u)
                    .set('Authorization', authorizationId)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(400);
                        done();
                    });
            });
        });

        testGroupName = 'PATCH';
    describe(testGroupName, () => {
        describe('basic test cases ', () => {
            it(`${testNr++} ${testGroupName} - No Auth. header - 401`, done => {
                chai
                    .request(app)
                    .patch(entityEndpoint)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(401);
                        done();
                    });
            });

            it(`${testNr++} ${testGroupName} - invalid ObjectId - 400`, done => {
                chai
                    .request(app)
                    .patch(entityEndpoint + '/abc')
                    .set('Authorization', authorizationId)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(400);
                        done();
                    });
            });

            it(`${testNr++} ${testGroupName} - 404`, done => {
                let payload = { 'firstname': 'Susi' };
                chai
                    .request(app)
                    .patch(entityEndpoint + '/' + notFoundId)
                    .set('Authorization', authorizationId)
                    .send(payload)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(404);
                        done();
                    });
            });
        });

        /* --------------------- update username ------------------- */
        describe('property username ', () => {
            let wrongUsers = [];
            let u = {};
            u.username = {};
            wrongUsers.push(u);

            u = {};
            u.username = 'online';
            u['wrongprop'] = 'hihi;'
            wrongUsers.push(u);

            u = {};
            u.username = 'online';
            u._id = '5fce46ccbcf604e0928f6659';
            wrongUsers.push(u);

            u = {};
            u.username = 'fredi';
            wrongUsers.push(u);

            u = {};
            u.username = 'fred@@i';
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - username - 400`, done => {
                    chai
                        .request(app)
                        .patch(entityEndpoint + '/' + updateId)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------- update password ------------------- */
        describe('property password ', () => {
            let wrongUsers = [];
            let u = {};
            u.password = {};
            wrongUsers.push(u);

            u = {};
            u.password = 'online';
            u['wrongprop'] = 'hihi;'
            wrongUsers.push(u);

            u = {};
            u.password = 'online';
            u._id = '5fce46ccbcf604e0928f6659';
            wrongUsers.push(u);

            u = {};
            u.password = '';
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - password - 400`, done => {
                    chai
                        .request(app)
                        .patch(entityEndpoint + '/' + updateId)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------- update age ------------------- */
        describe('property age ', () => {
            let wrongUsers = [];
            let u = {};
            u.age = {};
            wrongUsers.push(u);

            u = {};
            u.age = 'nix gut';
            wrongUsers.push(u);

            u = {};
            u.age = 55;
            u['wrongprop'] = 'hihi;'
            wrongUsers.push(u);

            u = {};
            u.age = 55;
            u._id = '5fce46ccbcf604e0928f6659';
            wrongUsers.push(u);

            u = {};
            u.age = 155;
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - age - 400`, done => {
                    chai
                        .request(app)
                        .patch(entityEndpoint + '/' + updateId)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------- update state ------------------- */
        describe('property state ', () => {
            let wrongUsers = [];
            let u = {};
            u.state = {};
            wrongUsers.push(u);

            u = {};
            u.state = 'nix gut';
            wrongUsers.push(u);

            u = {};
            u.state = 'online';
            u['wrongprop'] = 'hihi;'
            wrongUsers.push(u);

            u = {};
            u.state = 'online';
            u._id = '5fce46ccbcf604e0928f6659';
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - state - 400`, done => {
                    chai
                        .request(app)
                        .patch(entityEndpoint + '/' + updateId)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------- update firstname ------------------- */
        describe('property firstname ', () => {
            let wrongUsers = [];
            let u = {};
            u.firstname = {};
            wrongUsers.push(u);

            u = {};
            u.firstname = 'online';
            u['wrongprop'] = 'hihi;'
            wrongUsers.push(u);

            u = {};
            u.firstname = 'online';
            u._id = '5fce46ccbcf604e0928f6659';
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - firstname - 400`, done => {
                    chai
                        .request(app)
                        .patch(entityEndpoint + '/' + updateId)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------- update lastname ------------------- */
        describe('property lastname ', () => {
            let wrongUsers = [];
            let u = {};
            u.lastname = {};
            wrongUsers.push(u);

            u = {};
            u.lastname = 'online';
            u['wrongprop'] = 'hihi;'
            wrongUsers.push(u);

            u = {};
            u.lastname = 'online';
            u._id = '5fce46ccbcf604e0928f6659';
            wrongUsers.push(u);

            u = {};
            u.lastname = '';
            u.state = 'online';
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - lastname - 400`, done => {
                    chai
                        .request(app)
                        .patch(entityEndpoint + '/' + updateId)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* --------------------- update gender ------------------- */
        describe('property gender ', () => {
            let wrongUsers = [];
            let u = {};
            u.gender = {};
            wrongUsers.push(u);

            u = {};
            u.gender = 'online';
            u['wrongprop'] = 'hihi;'
            wrongUsers.push(u);

            u = {};
            u.gender = 'online';
            u._id = '5fce46ccbcf604e0928f6659';
            wrongUsers.push(u);

            u = {};
            u.gender = 'xxx';
            wrongUsers.push(u);

            u = {};
            u.gender = '';
            u.firstname = 'hans';
            wrongUsers.push(u);

            wrongUsers.forEach(wrongUser => {
                it(`${testNr++} ${testGroupName} - gender - 400`, done => {
                    chai
                        .request(app)
                        .patch(entityEndpoint + '/' + updateId)
                        .send(wrongUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });

        /* ------------------- working updates ------------------- */
        describe('working updates ', () => {
            let correctUpdatUsers = [];
            let u = {};
            u.username = 'updated@chat.com';
            correctUpdatUsers.push(u);

            u = {};
            u.password = 'password';
            correctUpdatUsers.push(u);

            u = {};
            u.firstname = 'update';
            u.lastname = 'update';
            u.gender = 'female';
            correctUpdatUsers.push(u);

            u = {};
            u.state = 'offline';
            u.age = 99;
            u.gender = 'male';
            correctUpdatUsers.push(u);

            u = {};
            u.age = 99;
            u.gender = 'male';
            u._id = updateId;
            correctUpdatUsers.push(u);

            u = {};
            u._id = '5fce46ccf4f27b02c72f5489';
            u.username = 'Franklin@chat.app';
            u.password = 'changed';

            correctUpdatUsers.forEach(correctUser => {
                it(`${testNr++} ${testGroupName} - correct update - 200`, done => {
                    chai
                        .request(app)
                        .patch(entityEndpoint + '/' + updateId)
                        .send(correctUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(200);

                            res.body.should.be.a('object');

                            Object.keys(res.body).length.should.eql(8);

                            res.body.should.have.property('_id');
                            expect(res.body._id).to.equal(updateId);
                            done();
                        });
                });
            });

            it(`${testNr++} ${testGroupName} - GET and check updates resource - 200`, done => {
                chai
                    .request(app)
                    .get(entityEndpoint + '/' + updateId)
                    .set('Authorization', authorizationId)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        Object.keys(res.body).length.should.eql(8);

                        res.body.should.have.property('_id');
                        expect(res.body._id).to.equal(updateId);
                        expect(res.body.firstname).to.equal('update');
                        expect(res.body.lastname).to.equal('update');
                        expect(res.body.gender).to.equal('male');
                        expect(res.body.age).to.equal(99);
                        expect(res.body.state).to.equal('offline');
                        expect(res.body.username).to.equal('updated@chat.com');
                        expect(res.body.password).to.equal('password');

                        done();
                    });
            });
        });

        describe('special fails', () => {
            let failingUsers = [];
            let u = {};
            failingUsers.push(u);

            u = {};
            u.username = "Henrietta@chat.app";
            failingUsers.push(u);

            failingUsers.forEach(failingUser => {
                it(`${testNr++} ${testGroupName} - failing special update - 400`, done => {
                    chai
                        .request(app)
                        .patch(entityEndpoint + '/' + updateId)
                        .send(failingUser)
                        .set('Authorization', authorizationId)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            res.should.have.status(400);
                            done();
                        });
                });
            });
        });
    });


    });

});
