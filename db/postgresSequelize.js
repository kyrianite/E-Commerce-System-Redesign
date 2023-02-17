/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.PG_DB, process.env.PG_USER, process.env.PG_PASS, {
  host: 'localhost',
  dialect: 'postgres',
});

async function createSchemas() {
  // reviews.csv
  // id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness
  const Reviews = sequelize.define('Reviews', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.BIGINT,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE,
    },
    summary: {
      type: DataTypes.STRING,
    },
    body: {
      type: DataTypes.STRING,
    },
    recommend: {
      type: DataTypes.BOOLEAN,
    },
    reported: {
      type: DataTypes.BOOLEAN,
    },
    reviewer_name: {
      type: DataTypes.STRING,
    },
    reviewer_email: {
      type: DataTypes.STRING,
    },
    reponse: {
      type: DataTypes.STRING,
    },
    helpfulness: {
      type: DataTypes.INTEGER,
    },
    photos_id: {
      type: DataTypes.BIGINT,
    },
    characteristic_id: {
      type: DataTypes.BIGINT,
    },
  }, {
    // other model options
  });

  // reviews-photos.csv
  // id,review_id,url
  const ReviewsPhotos = sequelize.define('ReviewsPhotos', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    review_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'Reviews',
        key: 'id',
      },
    },
    url: {
      type: DataTypes.STRING,
    },
  }, {
    // other model options
  });

  // characteristic_reviews.csv
  // id,characteristic_id,review_id,value
  const CharacteristicReviews = sequelize.define('CharacteristicReviews', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    characteristic_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'Characteristics',
        key: 'id',
      },
    },
    review_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'Reviews',
        key: 'id',
      },
    },
    value: {
      type: DataTypes.INTEGER,
    },
  }, {
    // other model options
  });

  // characteristics.csv
  // id,product_id,name
  const Characteristics = sequelize.define('Characteristics', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
  }, {
    // other model options
  });
}

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connected to postgres!');

    await createSchemas();
    await sequelize.sync({ force: true });
    console.log('Loaded Schemas!');

    await sequelize.close();
    console.log('Closed connection!');
  } catch (err) {
    console.log('Unable to connect to postgres', err);
  }
}

testConnection();
