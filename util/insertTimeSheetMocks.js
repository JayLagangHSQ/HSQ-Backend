const User = require('./models/User'); // Adjust the path accordingly

async function insertTimeSheetData(userId) {
  try {
    const userData = await User.findById(userId);

    const timeSheetData = [
      {
        "date": "2023-12-31T08:55:00.000Z",
        "status": "good",
        "clockIn": "2023-12-31T08:55:00.000Z",
        "clockOut": "2023-12-31T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829ce"
      },
      {
        "date": "2023-12-30T09:15:00.000Z",
        "status": "late",
        "clockIn": "2023-12-30T09:15:00.000Z",
        "clockOut": "2023-12-30T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829fa"
      },
      {
        "date": "2023-12-29T08:48:00.000Z",
        "status": "good",
        "clockIn": "2023-12-29T08:48:00.000Z",
        "clockOut": "2023-12-29T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829f9"
      },
      {
        "date": "2023-12-28T09:05:00.000Z",
        "status": "good",
        "clockIn": "2023-12-28T09:05:00.000Z",
        "clockOut": "2023-12-28T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829f8"
      },
      {
        "date": "2023-12-27T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-12-27T08:50:00.000Z",
        "clockOut": "2023-12-27T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829f7"
      },
      {
        "date": "2023-12-26T09:10:00.000Z",
        "status": "late",
        "clockIn": "2023-12-26T09:10:00.000Z",
        "clockOut": "2023-12-26T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829f6"
      },
      {
        "date": "2023-12-25T08:45:00.000Z",
        "status": "good",
        "clockIn": "2023-12-25T08:45:00.000Z",
        "clockOut": "2023-12-25T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829f5"
      },
      {
        "date": "2023-12-22T09:02:00.000Z",
        "status": "good",
        "clockIn": "2023-12-22T09:02:00.000Z",
        "clockOut": "2023-12-22T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829f4"
      },
      {
        "date": "2023-12-21T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-12-21T08:50:00.000Z",
        "clockOut": "2023-12-21T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829f3"
      },
      {
        "date": "2023-12-20T09:02:00.000Z",
        "status": "late",
        "clockIn": "2023-12-20T09:02:00.000Z",
        "clockOut": "2023-12-20T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829f2"
      },
      {
        "date": "2023-12-19T08:48:00.000Z",
        "status": "good",
        "clockIn": "2023-12-19T08:48:00.000Z",
        "clockOut": "2023-12-19T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829f1"
      },
      {
        "date": "2023-12-18T09:05:00.000Z",
        "status": "good",
        "clockIn": "2023-12-18T09:05:00.000Z",
        "clockOut": "2023-12-18T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829f0"
      },
      {
        "date": "2023-12-15T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-12-15T08:50:00.000Z",
        "clockOut": "2023-12-15T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829ef"
      },
      {
        "date": "2023-12-14T09:15:00.000Z",
        "status": "late",
        "clockIn": "2023-12-14T09:15:00.000Z",
        "clockOut": "2023-12-14T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829ee"
      },
      {
        "date": "2023-12-13T08:45:00.000Z",
        "status": "good",
        "clockIn": "2023-12-13T08:45:00.000Z",
        "clockOut": "2023-12-13T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829ed"
      },
      {
        "date": "2023-12-12T09:02:00.000Z",
        "status": "late",
        "clockIn": "2023-12-12T09:02:00.000Z",
        "clockOut": "2023-12-12T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829ec"
      },
      {
        "date": "2023-12-11T08:48:00.000Z",
        "status": "good",
        "clockIn": "2023-12-11T08:48:00.000Z",
        "clockOut": "2023-12-11T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829eb"
      },
      {
        "date": "2023-12-08T09:05:00.000Z",
        "status": "good",
        "clockIn": "2023-12-08T09:05:00.000Z",
        "clockOut": "2023-12-08T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829ea"
      },
      {
        "date": "2023-12-07T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-12-07T08:50:00.000Z",
        "clockOut": "2023-12-07T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829e9"
      },
      {
        "date": "2023-12-06T09:02:00.000Z",
        "status": "good",
        "clockIn": "2023-12-06T09:02:00.000Z",
        "clockOut": "2023-12-06T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829e8"
      },
      {
        "date": "2023-12-05T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-12-05T08:50:00.000Z",
        "clockOut": "2023-12-05T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829e7"
      },
      {
        "date": "2023-12-04T09:02:00.000Z",
        "status": "good",
        "clockIn": "2023-12-04T09:02:00.000Z",
        "clockOut": "2023-12-04T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829e6"
      },
      {
        "date": "2023-12-01T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-12-01T08:50:00.000Z",
        "clockOut": "2023-12-01T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829e5"
      },
      {
        "date": "2023-11-30T08:55:00.000Z",
        "status": "good",
        "clockIn": "2023-11-30T08:55:00.000Z",
        "clockOut": "2023-11-30T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829e4"
    },
    {
        "date": "2023-11-29T08:48:00.000Z",
        "status": "good",
        "clockIn": "2023-11-29T08:48:00.000Z",
        "clockOut": "2023-11-29T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829e3"
    },
    {
        "date": "2023-11-28T09:05:00.000Z",
        "status": "good",
        "clockIn": "2023-11-28T09:05:00.000Z",
        "clockOut": "2023-11-28T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829e2"
    },
    {
        "date": "2023-11-27T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-11-27T08:50:00.000Z",
        "clockOut": "2023-11-27T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829e1"
    },
    {
        "date": "2023-11-24T09:20:00.000Z",
        "status": "late",
        "clockIn": "2023-11-24T09:20:00.000Z",
        "clockOut": "2023-11-24T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829e0"
    },
    {
        "date": "2023-11-23T08:45:00.000Z",
        "status": "good",
        "clockIn": "2023-11-23T08:45:00.000Z",
        "clockOut": "2023-11-23T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829df"
    },
    {
        "date": "2023-11-22T09:02:00.000Z",
        "status": "good",
        "clockIn": "2023-11-22T09:02:00.000Z",
        "clockOut": "2023-11-22T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829de"
    },
    {
        "date": "2023-11-21T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-11-21T08:50:00.000Z",
        "clockOut": "2023-11-21T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829dd"
    },
    {
        "date": "2023-11-20T08:55:00.000Z",
        "status": "good",
        "clockIn": "2023-11-20T08:55:00.000Z",
        "clockOut": "2023-11-20T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829dc"
    },
    {
        "date": "2023-11-17T08:48:00.000Z",
        "status": "good",
        "clockIn": "2023-11-17T08:48:00.000Z",
        "clockOut": "2023-11-17T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829db"
    },
    {
        "date": "2023-11-16T09:05:00.000Z",
        "status": "good",
        "clockIn": "2023-11-16T09:05:00.000Z",
        "clockOut": "2023-11-16T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829da"
    },
    {
        "date": "2023-11-15T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-11-15T08:50:00.000Z",
        "clockOut": "2023-11-15T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829d9"
    },
    {
        "date": "2023-11-14T09:15:00.000Z",
        "status": "late",
        "clockIn": "2023-11-14T09:15:00.000Z",
        "clockOut": "2023-11-14T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829d8"
    },
    {
        "date": "2023-11-13T08:45:00.000Z",
        "status": "good",
        "clockIn": "2023-11-13T08:45:00.000Z",
        "clockOut": "2023-11-13T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829d7"
    },
    {
        "date": "2023-11-10T09:02:00.000Z",
        "status": "good",
        "clockIn": "2023-11-10T09:02:00.000Z",
        "clockOut": "2023-11-10T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829d6"
    },
    {
        "date": "2023-11-09T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-11-09T08:50:00.000Z",
        "clockOut": "2023-11-09T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829d5"
    },
    {
        "date": "2023-11-08T09:30:00.000Z",
        "status": "late",
        "clockIn": "2023-11-08T09:30:00.000Z",
        "clockOut": "2023-11-08T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829d4"
    },
    {
        "date": "2023-11-07T08:48:00.000Z",
        "status": "good",
        "clockIn": "2023-11-07T08:48:00.000Z",
        "clockOut": "2023-11-07T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829d3"
    },
    {
        "date": "2023-11-06T09:05:00.000Z",
        "status": "good",
        "clockIn": "2023-11-06T09:05:00.000Z",
        "clockOut": "2023-11-06T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829d2"
    },
    {
        "date": "2023-11-03T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-11-03T08:50:00.000Z",
        "clockOut": "2023-11-03T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829d1"
    },
    {
        "date": "2023-11-02T08:55:00.000Z",
        "status": "good",
        "clockIn": "2023-11-02T08:55:00.000Z",
        "clockOut": "2023-11-02T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829d0"
    },
    {
        "date": "2023-11-01T08:45:00.000Z",
        "status": "good",
        "clockIn": "2023-11-01T08:45:00.000Z",
        "clockOut": "2023-11-01T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829cf"
    },
    {
      "date": "2023-10-31T08:55:00.000Z",
      "status": "good",
      "clockIn": "2023-10-31T08:55:00.000Z",
      "clockOut": "2023-10-31T17:00:00.000Z",
      "_id": "65a904ffeb4f8cc9abb829ce"
    },
    {
        "date": "2023-10-30T08:48:00.000Z",
        "status": "good",
        "clockIn": "2023-10-30T08:48:00.000Z",
        "clockOut": "2023-10-30T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829cd"
    },
    {
        "date": "2023-10-27T09:05:00.000Z",
        "status": "good",
        "clockIn": "2023-10-27T09:05:00.000Z",
        "clockOut": "2023-10-27T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829cc"
    },
    {
        "date": "2023-10-26T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-10-26T08:50:00.000Z",
        "clockOut": "2023-10-26T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829cb"
    },
    {
        "date": "2023-10-25T09:20:00.000Z",
        "status": "late",
        "clockIn": "2023-10-25T09:20:00.000Z",
        "clockOut": "2023-10-25T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829ca"
    },
    {
        "date": "2023-10-24T08:45:00.000Z",
        "status": "good",
        "clockIn": "2023-10-24T08:45:00.000Z",
        "clockOut": "2023-10-24T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829c9"
    },
    {
        "date": "2023-10-23T09:02:00.000Z",
        "status": "good",
        "clockIn": "2023-10-23T09:02:00.000Z",
        "clockOut": "2023-10-23T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829c8"
    },
    {
        "date": "2023-10-20T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-10-20T08:50:00.000Z",
        "clockOut": "2023-10-20T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829c7"
    },
    {
        "date": "2023-10-19T08:55:00.000Z",
        "status": "good",
        "clockIn": "2023-10-19T08:55:00.000Z",
        "clockOut": "2023-10-19T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829c6"
    },
    {
        "date": "2023-10-18T09:30:00.000Z",
        "status": "late",
        "clockIn": "2023-10-18T09:30:00.000Z",
        "clockOut": "2023-10-18T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829c5"
    },
    {
        "date": "2023-10-17T09:05:00.000Z",
        "status": "good",
        "clockIn": "2023-10-17T09:05:00.000Z",
        "clockOut": "2023-10-17T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829c4"
    },
    {
        "date": "2023-10-16T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-10-16T08:50:00.000Z",
        "clockOut": "2023-10-16T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829c3"
    },
    {
        "date": "2023-10-13T08:58:00.000Z",
        "status": "good",
        "clockIn": "2023-10-13T08:58:00.000Z",
        "clockOut": "2023-10-13T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829c2"
    },
    {
        "date": "2023-10-12T09:15:00.000Z",
        "status": "late",
        "clockIn": "2023-10-12T09:15:00.000Z",
        "clockOut": "2023-10-12T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829c1"
    },
    {
        "date": "2023-10-11T09:02:00.000Z",
        "status": "good",
        "clockIn": "2023-10-11T09:02:00.000Z",
        "clockOut": "2023-10-11T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829c0"
    },
    {
        "date": "2023-10-10T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-10-10T08:50:00.000Z",
        "clockOut": "2023-10-10T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829bf"
    },
    {
        "date": "2023-10-09T08:55:00.000Z",
        "status": "good",
        "clockIn": "2023-10-09T08:55:00.000Z",
        "clockOut": "2023-10-09T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829be"
    },
    {
        "date": "2023-10-06T08:48:00.000Z",
        "status": "good",
        "clockIn": "2023-10-06T08:48:00.000Z",
        "clockOut": "2023-10-06T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829bd"
    },
    {
        "date": "2023-10-05T09:05:00.000Z",
        "status": "good",
        "clockIn": "2023-10-05T09:05:00.000Z",
        "clockOut": "2023-10-05T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829bc"
    },
    {
        "date": "2023-10-04T08:50:00.000Z",
        "status": "good",
        "clockIn": "2023-10-04T08:50:00.000Z",
        "clockOut": "2023-10-04T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829bb"
    },
    {
        "date": "2023-10-03T08:55:00.000Z",
        "status": "good",
        "clockIn": "2023-10-03T08:55:00.000Z",
        "clockOut": "2023-10-03T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829ba"
    },
    {
        "date": "2023-10-02T08:45:00.000Z",
        "status": "good",
        "clockIn": "2023-10-02T08:45:00.000Z",
        "clockOut": "2023-10-02T17:00:00.000Z",
        "_id": "65a904ffeb4f8cc9abb829b9"
    }
      
      // ... (insert other time sheet data here)
    ];

    userData.timeSheet = timeSheetData;
    await userData.save();

    console.log('Time sheet data inserted successfully');
  } catch (error) {
    console.error('Error inserting time sheet data:', error.message);
  }
}

// Replace 'userId' with the actual ID of the user for whom you want to insert time sheet data
// insertTimeSheetData('658442811f9674f4cca7c10b');

