/* eslint-disable no-shadow */
/* eslint-disable import/extensions */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-unresolved */
const http = require('k6/http');
const { check } = require('k6');
const { describe, expect } = require('https://jslib.k6.io/k6chaijs/4.3.4.2/index.js');
const { URLSearchParams } = require('https://jslib.k6.io/url/1.0.0/index.js');

const url = 'http://localhost:3000/reviews/';
const headers = { 'Content-Type': 'application/json' };

export default function () {
  describe('GET Review for Product 40344', () => {
    const searchParams = new URLSearchParams([
      ['page', 1],
      ['count', 5],
      ['sort', 'relevant'],
      ['product_id', 40344],
    ]);
    const response = http.get(`${url}?${searchParams.toString()}`);
    expect(response.status, 'response status').to.equal(200);
    expect(response).to.have.validJsonBody();
  });

  describe('POST Review for Product 40344', () => {
    const data = {
      product_id: 40344,
      rating: 3,
      summary: 'Summary for review product 40344',
      body: 'Body for review product 40344',
      recommend: false,
      name: 'TiredHRStudent',
      email: 'tiredstudent@HR.com',
      photos: [],
      characteristics: { 134988: 3 },
    };
    const response = http.post(url, JSON.stringify(data), { headers });
    expect(response.status, 'response status').to.equal(201);
  });

  describe('GET Meta Data for Product 40344', () => {
    const searchParams = new URLSearchParams([
      ['product_id', 40344],
    ]);
    const response = http.get(`${url}meta?${searchParams.toString()}`);
    expect(response.status, 'response status').to.equal(200);
    expect(response).to.have.validJsonBody();
  });

  describe('PUT Mark Review as Helpful', () => {
    const data = { review_id: 5774953 };
    const response = http.put(`${url}${data.review_id}/helpful`);
    check(response, { 'response code was 204': (response) => response.status === 204 });
  });

  describe('PUT Report Review 5774953', () => {
    const data = { review_id: 5774953 };
    const response = http.put(`${url}${data.review_id}/report`);
    check(response, { 'response code was 204': (response) => response.status === 204 });
  });
}
