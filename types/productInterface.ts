interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: number;
  tags: string[];
  stock: number;
  status: string;
  is_available: boolean;
  image_url: string;
}

export default Product;
