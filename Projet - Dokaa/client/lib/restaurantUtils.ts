import { Restaurant } from './api';

export function normalizeRestaurantName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface GroupedRestaurant {
  name: string;
  normalizedName: string;
  restaurants: Restaurant[];
  displayRestaurant: Restaurant;
  count: number;
}

export function groupRestaurantsByName(restaurants: Restaurant[], byCity: boolean = false): GroupedRestaurant[] {
  const grouped = new Map<string, Restaurant[]>();
  
  for (const restaurant of restaurants) {
    const normalizedName = normalizeRestaurantName(restaurant.name);
    const key = byCity && restaurant.city 
      ? `${normalizedName}::${restaurant.city.toLowerCase()}`
      : normalizedName;
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(restaurant);
  }
  
  const result: GroupedRestaurant[] = [];
  
  for (const [key, restaurantList] of grouped.entries()) {
    const firstRestaurant = restaurantList[0];
    const normalizedName = byCity ? key.split('::')[0] : key;
    result.push({
      name: firstRestaurant.name,
      normalizedName,
      restaurants: restaurantList,
      displayRestaurant: firstRestaurant,
      count: restaurantList.length
    });
  }
  
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

export function getRestaurantNameKey(name: string): string {
  return normalizeRestaurantName(name);
}
