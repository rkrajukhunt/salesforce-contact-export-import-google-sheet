const { google } = require("googleapis");

const sheets = google.sheets("v4");
const querystring = require("querystring");
const axios = require("axios");

const {
  SF_LOGIN_USERNAME,
  SF_LOGIN_PASSWORD,
  SF_LOGIN_GRANT_TYPE,
  SF_LOGIN_CLIENT_ID,
  SF_LOGIN_CLIENT_SECRET,
} = process.env;

const googleAuth = new google.auth.JWT(
  "eb-741@coherent-vision-314713.iam.gserviceaccount.com",
  null,
  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1aHlRAg/yxGxY\nbrgeY1WpbgH3UdZ8iXwuv1IwKHkWrp/uPc+vaEshsoP+BOmdHL6Xn79regPVZmlR\nxB8vg5ttkwjwR/zomtjMSr3qPvw3bMb7AK6eFIK8/3wgbKO+UZSpuEwBjuDaLiIh\nBCjrqUmAqz1xSAqf1UE1oMKCgAzfH2GD9UL/3qFGldkKncovinR/xIvNpk+Z7AS/\n8WrC17YSBnQm9WLAGDC/iOXIaUQln3MeNNmLE8/PVKZ9jCvqb2wX2fGo11PdZjmG\nhHpuOoBR5nUCYfRePsqSqvwOMeGXt5css4+fMh0jOBJ2xNxM9K8c28ttiEu4cyLQ\n3oVVeGw7AgMBAAECggEADi9LoSp0ncp/IFEUA4hH5/YqoDCdgWJsu+kI36wif8QK\nzGG37iLNESb4zDGNJNRdENUUbi59wz99R7/6okf7rM88+TDf1T5aamsDu5/OL/VI\n/9J3VPQMnwOpLI3iJd0SL00yYELQUS8fSw6ctoSnszBwnv1/myzdKvjVjMe/eejD\n6v4qx0SlH3SnxqQcW0g68oLqrh8i6fDAtKCP8KQili9RqMaDuTit5VtVCsHyQjva\n2VFFch3qqvFy/F9D4HPJ8drAywZEqcMt4p4TBEa6hwl/EMjgq0uaXtoyVseQGGeq\nLXoXnvzhRC6Y93xDa8ViG3aheWkvQ2PSae1MTOR/EQKBgQDsKDfZlPvakZY9VDHV\na/BaTsQquVJqSsSJnImmPqpEc8K50nf755s5G0ImIP7MND8znD9Li6QZkFNFnYlX\nlcmbLZC9zmQSwU3euaZlskqiSX1VgpoEIFyzWG3V7cEuesw5ozsAhJSxUO+GroVN\nMFvQfKUqydCGZd0WmdIIw2ZfywKBgQDEpphH5nTA220AIm60LRraSRZM5S2nD2B/\no+3SS0YV9TFgdE2eaPdN0G0YUlD3EndZQFxgSybWMzW8Z0351jm9v/aXwGuG2M/p\nNdPIiJhHc7CuFbO7x3k/5NxMq0XrI+zcJMVckcKZzYta2JjvZn3zCmIXqGfh3miy\niArAc463UQKBgQCBfDPTS4skdrsn+WgxmzN4cMPCoUZ9HW3R/lDDJIz7Z3WXqb08\nE+vaTgXhHipXETauN7fE1lYt5iKigxRxP6IBQeShDe91ESR/QM/p5u5hOWZNYoTM\nSmpJs+zVZb2MnKwp1kRdrlRRPQ14jWxtvFw7Xny5j1qUtnmZENJHF8ykLQKBgAoH\nLNDN0bpb9i0BlH+fpTTocTiunytbv2IC7AfDSumnvULb63FejO3s6QNKf1J6IJfu\njkdizbIynlTjN7i70en5Ngv7BgC0YbXUxt39CTbrkWDvPmEfBPHbK9jFCyW4iUWY\nom/cBv5s2uRhEztyEI4qQ2JNdi6wdspT4ah6vBZhAoGBAII4VRToO4VUdEEmNxxf\nsy2W9/BUpS8D0b/XOvDsBoIQLZAMga85itXad+w4e7vTbox4Q1h3Cs/+nVj18tqe\nuxnhRsN+7Xno5XkBeMtsmTXzMP0v4bPcd4Ry57AuDHn4F42ImqIynJqi73cIDwrm\nwUwDhHk0KI0yzDvuYuXRzkOi\n-----END PRIVATE KEY-----\n",
  ["https://www.googleapis.com/auth/spreadsheets"],
  null
);

var sfToken = null;

const loginPayload = {
  username: SF_LOGIN_USERNAME,
  password: SF_LOGIN_PASSWORD,
  grant_type: SF_LOGIN_GRANT_TYPE,
  client_id: SF_LOGIN_CLIENT_ID,
  client_secret: SF_LOGIN_CLIENT_SECRET,
};

axios
  .post(
    "https://login.salesforce.com/services/oauth2/token",
    querystring.stringify(loginPayload),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  )
  .then((value) => {
    sfToken = value.data.access_token;
  })
  .catch((err) => {
    console.log(err.response.data);
  });

exports.exportFile = function (req, res) {
  axios
    .get(
      "https://emperorbrains2-dev-ed.my.salesforce.com/services/data/v42.0/query/?q=SELECT+Name,Id,Email,Phone+FROM+Contact",
      {
        headers: {
          Authorization: `Bearer ${sfToken}`,
        },
      }
    )
    .then((value) => {
      res.json({
        code: 200,
        status: "Success",
        message: "Contacts Export Successfully",
        urls: "https://docs.google.com/spreadsheets/d/1Z5naDGt9Jv6vV-DLy2Vvb4BdQ4o54hDUvmZ-lg3mv7E/edit#gid=1597669205",
      });
      createSheet(value.data.records);
    });
};

exports.hello = function (req, res) {
  res.json({
    message: "Welcome to Salesforce Export Contact Functionality"
  })
}

async function createSheet(value) {
  let values = [];
  const headers = [];
  for (const header in value[0]) {
    if (header !== "attributes") headers.push(header);
  }
  values = [headers];

  value.filter((i) => {
    const newData = [];
    headers.filter((h) => {
      newData.push(i[h]);
    });
    values.push(newData);
  });

  sheets.spreadsheets.values.update(
    {
      auth: googleAuth,
      spreadsheetId: "1Z5naDGt9Jv6vV-DLy2Vvb4BdQ4o54hDUvmZ-lg3mv7E",
      range: ["Sheet1!A1"],
      valueInputOption: "USER_ENTERED",
      resource: {
        majorDimension: "ROWS",
        values: values,
      },
    },
    (err, response) => {
      if (err) {
        console.log(`The API returned an error: ${err}`);
        return;
      } else {
        console.log(response);
      }
    }
  );
}
