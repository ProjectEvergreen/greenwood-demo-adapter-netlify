export interface Product {
  id: number;
  title: string;
  thumbnail: string;
}

interface ProductsResponse {
  products: Product[];
}

function getProducts(): Promise<Product[]>;
function getProducts(id: string | number): Promise<Product>;
async function getProducts(id?: string | number): Promise<Product | Product[]> {
  const idSuffix = id ? `/${id}` : '';
  const data = (await fetch(`https://dummyjson.com/products${idSuffix}`)
    .then(resp => resp.json()));

  if (id) {
    return data as Product;
  }

  return (data as ProductsResponse).products;
}

export { getProducts };
