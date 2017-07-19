const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Product = require('../../src/models/Product.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validProduct1, validProduct2, invalidProduct1 } = require('../fixtures/products.json')

// Tests for: GET /products
tape('GET /products when nothing in database', t => {
  supertest(server)
    .get('/products')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.length, 0, 'should initially return empty array')
      dropCollectionAndEnd(Product, t)
    })
})

tape('GET /products, with and without query parameters', t => {
  Product.create(validProduct1, validProduct2)
    .then(() => {
      supertest(server)
        .get('/products')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.length, 2, 'response body should be an array with length 2')
          t.ok(res.body.map(product => product.name).includes(validProduct1.name), 'first product has been added')
          t.ok(res.body.map(product => product.name).includes(validProduct2.name), 'second product has been added')
        })
      supertest(server)
        .get('/products?category=handicraft')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.length, 1, 'filtered response body should be an array with length 1')
          t.equal(res.body[0].name, 'hand-made mug', 'results should be filtered correctly by url query parameters')
          dropCollectionAndEnd(Product, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: GET /products/:id
tape('GET /products/:id with id of something not in the database', (t) => {
  supertest(server)
    .get('/products/10')
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message.includes('Database error'), 'response message should contain "Database error"')
      dropCollectionAndEnd(Product, t)
    })
})

tape('GET /products/:id with id of something in the database', (t) => {
  Product.create(validProduct1)
    .then(result => {
      supertest(server)
        .get(`/products/${result.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.name, validProduct1.name, 'should get product with correct name.')
          dropCollectionAndEnd(Product, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: POST /products

// Tests for: PUT /products/:id

// Tests for: DELETE /products/:id
