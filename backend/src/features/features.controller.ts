import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) { }

  /**
   * Create a feature
   * @param createFeatureDto feature data
   * @returns created feature
   */
  @Post()
  create(@Body() createFeatureDto: CreateFeatureDto) {
    return this.featuresService.create(createFeatureDto);
  }

  /**
   * Get all features
   * @returns all features
   */
  @Get()
  findAll() {
    return this.featuresService.findAll();
  }

  /**
   * Get a feature by id
   * @param id feature id
   * @returns feature
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featuresService.findOne(id);
  }

  /**
   * Update a feature
   * @param id feature id
   * @param updateFeatureDto feature data
   * @returns updated feature
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeatureDto: UpdateFeatureDto) {
    return this.featuresService.update(id, updateFeatureDto);
  }

  /**
   * Delete a feature
   * @param id feature id
   * @returns deleted feature
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.featuresService.remove(id);
  }
}
