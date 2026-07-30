import type { City } from '../../api/schema';

export const CITIES: City[] = [
  { id: 1, name: 'Москва', region: 'Московская область' },
  { id: 2, name: 'Санкт-Петербург', region: 'Ленинградская область' },
  { id: 3, name: 'Новосибирск', region: 'Новосибирская область' },
  { id: 4, name: 'Екатеринбург', region: 'Свердловская область' },
  { id: 5, name: 'Казань', region: 'Республика Татарстан' },
  { id: 6, name: 'Нижний Новгород', region: 'Нижегородская область' },
  { id: 7, name: 'Челябинск', region: 'Челябинская область' },
  { id: 8, name: 'Самара', region: 'Самарская область' },
  { id: 9, name: 'Ростов-на-Дону', region: 'Ростовская область' },
  { id: 10, name: 'Краснодар', region: 'Краснодарский край' },
  { id: 11, name: 'Оренбург', region: 'Оренбургская область' },
  { id: 12, name: 'Уфа', region: 'Республика Башкортостан' },
  { id: 13, name: 'Пермь', region: 'Пермский край' },
  { id: 14, name: 'Воронеж', region: 'Воронежская область' },
  { id: 15, name: 'Волгоград', region: 'Волгоградская область' },
];

export function findCity(id: number): City {
  return CITIES.find((c) => c.id === id) ?? CITIES[0];
}
