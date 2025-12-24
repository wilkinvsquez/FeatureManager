import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { FIREBASE_CONNECTION } from 'src/firebase/firebase.provider';
import * as admin from 'firebase-admin';

@Injectable()
export class AssetsService {
  private collection: admin.firestore.CollectionReference;

  constructor(
    @Inject(FIREBASE_CONNECTION)
    private readonly firestore: admin.firestore.Firestore,
  ) {
    this.collection = this.firestore.collection('assets');
  }

  /**
   * Create a new asset on Firebase
   * @param createAssetDto  CreateAssetDto
   * @returns Asset
   */
  async create(createAssetDto: CreateAssetDto) {
    const docRef = this.collection.doc(createAssetDto.key);

    const doc = await docRef.get();
    if (doc.exists) {
      throw new Error(`Asset with key ${createAssetDto.key} already exists`);
    }
    const newAsset = {
      ...createAssetDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await docRef.set(newAsset);
    return { id: docRef.id, ...newAsset };
  }


  /**
   * Get all assets from Firebase
   * @returns Asset[]
   */
  async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Asset));
  }

  /**
   * Get a single asset from Firebase
   * @param key string
   * @returns Asset
   */
  async findOne(key: string) {
    const doc = await this.collection.doc(key).get();
    if (!doc.exists) {
      throw new NotFoundException(`Asset with key "${key}" not found`);
    }
    return { id: doc.id, ...doc.data() } as Asset;
  }


  /**
   * Update an asset on Firebase
   * @param key string
   * @param updateAssetDto UpdateAssetDto
   * @returns Asset
   */
  async update(key: string, updateAssetDto: UpdateAssetDto) {
    const docRef = this.collection.doc(key);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException(`Asset with key "${key}" not found`);
    }
    await docRef.update({
      ...updateAssetDto,
      updatedAt: new Date(),
    });
    return this.findOne(key);
  }

  /**
   * Delete an asset from Firebase
   * @param key string
   * @returns { id: string, deleted: true }
   */
  async remove(key: string) {
    await this.collection.doc(key).delete();
    return { id: key, deleted: true };
  }
}
