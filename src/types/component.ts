export type ComponentType = 'CPU' | 'GPU' | 'RAM' | 'Motherboard' | 'Storage' | 'PSU' | 'Case' | 'Cooler';

export interface Component {
  id: number;
  name: string;
  type: ComponentType;
  price: number;
  image_url: string;
  description: string;
  specs: string;
  created_at: string;
  updated_at: string;
}

export interface PCBuild {
  cpu?: Component;
  gpu?: Component;
  ram?: Component;
  motherboard?: Component;
  storage?: Component;
  psu?: Component;
  case?: Component;
  cooler?: Component;
  totalPrice: number;
}
