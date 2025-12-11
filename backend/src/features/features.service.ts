import { Inject, Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { Feature } from './entities/feature.entity';
import { FIREBASE_CONNECTION } from 'src/firebase/firebase.provider';
import * as admin from 'firebase-admin';


@Injectable()
export class FeaturesService {

  private collection: admin.firestore.CollectionReference;

  constructor(
    @Inject(FIREBASE_CONNECTION)
    private readonly firestore: admin.firestore.Firestore,
  ) {
    this.collection = this.firestore.collection('features');
  }

  /**
   * Create a feature
   * @param createFeatureDto feature data
   * @returns created feature
   */
  async create(createFeatureDto: CreateFeatureDto) {
    const docRef = await this.collection.add({
      ...createFeatureDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...createFeatureDto };
  }

  /**
   * Get all features
   * @returns all features
   */
  async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feature));
  }

  /**
   * Get a feature by id
   * @param id feature id
   * @returns feature
   */
  async findOne(id: string) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Feature;
  }

  /**
   * Update a feature
   * @param id feature id
   * @param updateFeatureDto feature data
   * @returns updated feature
   */
  async update(id: string, updateFeatureDto: UpdateFeatureDto) {
    await this.collection.doc(id).set({
      ...updateFeatureDto,
      updatedAt: new Date(),
    });
    return this.findOne(id);
  }

  /**
   * Delete a feature
   * @param id feature id
   * @returns deleted feature
   */
  async remove(id: string) {
    await this.collection.doc(id).delete();
    return { id };
  }
}
