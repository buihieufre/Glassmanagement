# Product API Documentation

## 1. Get All Products
**Endpoint:** `/get`  
**Method:** `GET`  
**Description:** Retrieves all products.  

### Request
- No parameters required.

### Response
- **Status Code:** `200 OK`
- **Body:**  
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "name": "string",
        "price": "number",
        "description": "string",
        "category": "string"
      }
    ]
  }
  ```

---

## 2. Get Filter Options
**Endpoint:** `/get-filter-option`  
**Method:** `GET`  
**Description:** Retrieves filter options for products.  

### Request
- No parameters required.

### Response
- **Status Code:** `200 OK`
- **Body:**  
  ```json
  {
    "success": true,
    "data": {
      "categories": ["string"],
      "priceRange": {
        "min": "number",
        "max": "number"
      }
    }
  }
  ```

---

## 3. Get Paginated Products
**Endpoint:** `/get-paginated`  
**Method:** `POST`  
**Description:** Retrieves products in a paginated format.  

### Request
- **Body:**  
  ```json
  {
    "page": "number",
    "limit": "number",
    "filters": {
      "category": "string",
      "priceRange": {
        "min": "number",
        "max": "number"
      }
    }
  }
  ```

### Response
- **Status Code:** `200 OK`
- **Body:**  
  ```json
  {
    "success": true,
    "data": {
      "products": [
        {
          "id": "string",
          "name": "string",
          "price": "number",
          "description": "string",
          "category": "string"
        }
      ],
      "pagination": {
        "currentPage": "number",
        "totalPages": "number",
        "totalItems": "number"
      }
    }
  }
  