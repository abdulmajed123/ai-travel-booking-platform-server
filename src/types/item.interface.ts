import { Types } from "mongoose";

export interface ILocation {
  country?: string;
  city?: string;
  area?: string;
}

export interface IItinerary {
  day?: number;
  title?: string;
  description?: string;
}

export interface IItem {
  title: string;
  description: string;
  shortDescription?: string;

  image: string;
  images?: string[];

  price: number;
  discountPrice?: number;

  rating?: number;

  location?: ILocation;

  category: string;

  duration?: string;
  availableDates?: Date[];

  facilities?: string[];
  highlights?: string[];

  maxPeople?: number;
  availableSeats?: number;

  itinerary?: IItinerary[];

  aiTags?: string[];

  createdBy?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}
