async function getProducts(id) {
  const idSuffix = id ? `/${id}` : '';
  const data = (await fetch(`https://dummyjson.com/products${idSuffix}`)
    .then(resp => resp.json()));

  if (id) {
    return data;
  }

  return data.products;
}

export { getProducts };