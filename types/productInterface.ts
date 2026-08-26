interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  tags: string[];
  stock: number;
  status: string;
  is_available: boolean;
  image_url: string;
}

export default Product;
