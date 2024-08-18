/* Reqs and ruls:

API URL - https://api.ecommerce.com/products

GET request return JSON:

{
    "total": 99999,
    "count": 1000,
    "products": [{}, {}, ...]
}

Description:

{
    "total": 99999,             - how many poducts there are for this price range
    "count": 1000,              - how many products were returned
    "products": [{}, {}, ...]   - array of products with the length of count
}

'minPrice' and 'maxPrice' query parameters can be used. The other parametrs are not available.

Every API call return max 1000 products.

Products are in range of $0 to $100 000 costs.

**********

*Goal* - array with all the product on the webpage - 'products'.

*Questions to answer* - Is there some expectations your code relies on? If yes, write it in the comments. Could the code be written in a way that does not depend on these expectations?

***** Is there some expectations your code relies on?***
ANSWER - Yes, firstly, it is the structure of JSON object, that contains total, count, products. The code assumes that the API will always return a maximum of 1000 products per call.

***** Could the code be written in a way that does not depend on these expectations?***
ANSWER - Yes, for example, total is not requeired, only count parametr could be used, but more calls will be made. There also could be a scenario to check if the count returned bigger number as expected(1000).

*/

/* 
SOLUTION:

1. Create async function to make API calls to the webpage and return JSON response.

2. Use binary search for better and quicker search, this algorythm will allow to create as less as possible calls.

    2.1. The whole data will be devided by price(minPrice and maxPrice), the API call will be made for the first half - if the returned response will contain less then 1000 products, the call for another half will be made - if the returned response will contain more then 1000 products, this part will be halfed and step 2.1 will be repeated.

    2.2. All responses , that will contain less than 1000 responses will be push to 'products' array.

3. An array of products will be returned.

4. Answer questions from the task.
*/

// Setting specified parametrs and variables
const ecommerceUrl = "https://api.ecommerce.com/products";
const maxPrice = 100000;
const minPrice = 0;


// First step - creating a func that will make an API call to provided URL and return JSON response, using parametrs of minPrice and maxPrice for making the call
async function fetchProducts(startPrice, endPrice) {
  try {
    const url = `${ecommerceUrl}?minPrice=${startPrice}&maxPrice=${endPrice}`;

    const response = await fetch(url);

    // if there is an issue with response - func will throw an error
    if (!response.ok) {
      throw new Error('Error in response');
    };

    const products = await response.json();

    // returning JSON response of products
    return products;

  } catch (error) {
    console.error('There is an issue with the API call:', error);
    return null;
    // the func will return null in case of an error
  }
}


//  Decided to create a recursive function to create an array of all products within the specified price range, the products will be pushed to result Products

async function creatingArrayOfAllProducts(minPrice, maxPrice, resultProducts = []) {

  // founding the middle price, so we can split the range to halves 
  let middlePrice = Math.floor((minPrice + maxPrice) / 2);

   // checking and extracting products from the first half
  const productsData = await fetchProducts(minPrice, middlePrice); 

  if (productsData) {
    // extracting total, count and product from JSON
    let { total, count, products } = productsData;

    // if the count of products in array is less then 1000 or total amount equal to 1000 - only in this case we extract all values for the range - so push the data to a result array
    if (count < 1000 || total === 1000) {
      resultProducts.push(...products)
    } else {

      // if not, the ranged will be split again and the func will be repeated
      await creatingArrayOfAllProducts(minPrice, middlePrice, resultProducts)
    }
  }

  // repeating the same movements for the second range starting from the middle price + 1 value, so the products would not repeat
  const secondProductData = await fetchProducts(middlePrice + 1, maxPrice);

  if (secondProductData) {
    let { total, count, products } = secondProductData;

    if (count < 1000 || total === 1000) {
      resultProducts.push(...products)
    } else {
      await creatingArrayOfAllProducts((middlePrice + 1, maxPrice, resultProducts)
      )
    }
  }

  // returning the array of ALL products
  return resultProducts;
}

// calling the function with specified parametrs and returning allProducts, that contain an array of all products from the provided URL
creatingArrayOfAllProducts(minPrice, maxPrice).then(allProducts => {
  return allProducts }) 