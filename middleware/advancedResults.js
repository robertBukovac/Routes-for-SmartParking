const advancedResults = (model, populate) => async (req, res, next) => {
let query;
  
//Copy req.query
const reqQuery = { ...req.query };

//Fields to exclude => daje nam mogucnost za querye tj da ga ne matcha kao field
const removeFields = ['select', 'sort', 'page', 'limit'];

//Loop over removeFields and delete them from reqQeuery
removeFields.forEach(param => delete reqQuery[param]);

//Create query string
let queryStr = JSON.stringify(reqQuery);

//Finding resource
query = model.find(JSON.parse(queryStr));

//Select fields
if (req.query.select) {
    //da dobijemo 2 querya odvojena razmakom(space-om)
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

//Sort
if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

//Pagination => stranice sa prikazanim bootcampvoima,koliko ih na stranici stavit
const page = parseInt(req.query.page, 10) || 1;
const limit = parseInt(req.query.limit, 10) || 25;
const startIndex = (page - 1) * limit;
const endIndex = page * limit;
const total = await model.countDocuments();

query = query.skip(startIndex).limit(limit);

//Executing query
const results = await query;

//Pagination result
const pagination = {};

if (endIndex < total) {
  pagination.next = {
    page: page + 1,
    limit: limit
  };
}

if (startIndex > 0) {
  pagination.prev = {
    page: page - 1,
    limit: limit
  };
}

res.advancedResults = {
  succes: true,
  count: results.length,
  pagination,
  data: results
};
next();
};

module.exports = advancedResults;
