/* eslint-disable import/no-unresolved */
const http = require('k6/http');
const { sleep } = require('k6');

export default function () {
  http.get('https://test.k6.io');
  sleep(1);
}
