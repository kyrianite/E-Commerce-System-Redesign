DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS characteristics CASCADE;
DROP TABLE IF EXISTS characteristic_reviews CASCADE;

CREATE TABLE products (
  id                  SERIAL PRIMARY KEY,
  name                VARCHAR(255),
  slogan              TEXT,
  description         TEXT,
  category            VARCHAR(255),
  default_price       NUMERIC(1000, 2)
);

CREATE TABLE reviews (
  id                  SERIAL PRIMARY KEY,
  product_id          INTEGER REFERENCES products(id),
  rating              INTEGER,
  date                VARCHAR(255),
  summary             TEXT,
  body                TEXT,
  recommend           BOOLEAN,
  reported            BOOLEAN,
  reviewer_name       VARCHAR(255),
  reviewer_email      VARCHAR(255),
  response            TEXT,
  helpfulness         SMALLINT,
  photos              JSONB
);

CREATE INDEX reviews_pID_index ON reviews(product_id);

CREATE TABLE characteristics (
  id                  SERIAL PRIMARY KEY,
  product_id          INTEGER REFERENCES products(id),
  name                VARCHAR(255)
);

CREATE INDEX characteristics_pID_index ON characteristics(product_id);


CREATE TABLE characteristic_reviews (
  id                  SERIAL PRIMARY KEY,
  characteristic_id   INTEGER REFERENCES characteristics(id),
  review_id           INTEGER REFERENCES reviews(id),
  value               INTEGER
);

CREATE INDEX characteristic_reviews_cID_index ON characteristic_reviews(characteristic_id);
CREATE INDEX characteristic_reviews_rID_index ON characteristic_reviews(review_id);

