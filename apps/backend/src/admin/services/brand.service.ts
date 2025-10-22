import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from '../schemas/brand.schema';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private brandModel: Model<BrandDocument>,
  ) {}

  async findAll(): Promise<Brand[]> {
    return this.brandModel.find().exec();
  }

  async count(): Promise<number> {
    return this.brandModel.countDocuments().exec();
  }

  async findByUserId(userId: string): Promise<Brand | null> {
    return this.brandModel.findOne({ userId }).exec();
  }

  async create(brandData: Partial<Brand>): Promise<Brand> {
    const brand = new this.brandModel(brandData);
    return brand.save();
  }

  async update(id: string, brandData: Partial<Brand>): Promise<Brand | null> {
    return this.brandModel
      .findByIdAndUpdate(id, brandData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Brand | null> {
    return this.brandModel.findByIdAndDelete(id).exec();
  }
}
