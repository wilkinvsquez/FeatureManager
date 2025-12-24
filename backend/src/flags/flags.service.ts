import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlagDto } from './dto/create-flag.dto';
import { UpdateFlagDto } from './dto/update-flag.dto';
import { Flag } from './entities/flag.entity';
import { FIREBASE_CONNECTION } from 'src/firebase/firebase.provider';
import * as admin from 'firebase-admin';

@Injectable()
export class FlagsService {
  private collection: admin.firestore.CollectionReference;

  constructor(
    @Inject(FIREBASE_CONNECTION)
    private readonly firestore: admin.firestore.Firestore,
  ) {
    this.collection = this.firestore.collection('flags');
  }

  /**
   * Creates a new flag
   * @param createFlagDto The flag to create
   * @returns The created flag to the client
   */
  async create(createFlagDto: CreateFlagDto) {
    const existing = await this.collection
      .where('serviceId', '==', createFlagDto.serviceId)
      .where('keyname', '==', createFlagDto.keyname)
      .get();
    if (!existing.empty) {
      throw new Error(`Flag '${createFlagDto.keyname}' already exists for service '${createFlagDto.serviceId}'`);
    }
    const newFlag = {
      ...createFlagDto,
      updatedAt: new Date(),
    };
    const docRef = await this.collection.add(newFlag);
    return { id: docRef.id, ...newFlag };
  }

  /**
   * Find all flags
   * @param serviceId The service id to filter by
   * @returns The flags to the client
   */
  async findAll(serviceId?: string) {
    let query: admin.firestore.Query = this.collection;

    if (serviceId) {
      query = query.where('serviceId', '==', serviceId);
    }
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Flag));
  }

  /**
   * Find a flag by id
   * @param id The flag id to find
   * @returns The flag to the client
   */
  async findOne(id: string) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Flag with ID "${id}" not found`);
    }
    return { id: doc.id, ...doc.data() } as Flag;
  }

  /**
   * Update a flag
   * @param id The flag id to update
   * @param updateFlagDto The flag to update
   * @returns The updated flag to the client
   */
  async update(id: string, updateFlagDto: UpdateFlagDto) {
    const docRef = this.collection.doc(id);
    await docRef.update({
      ...updateFlagDto,
      updatedAt: new Date(),
    });
    return this.findOne(id);
  }

  /**
   * Delete a flag
   * @param id The flag id to delete
   * @returns The deleted flag to the client
   */
  async remove(id: string) {
    await this.collection.doc(id).delete();
    return { id, deleted: true };
  }
}
