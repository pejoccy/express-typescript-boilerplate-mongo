import { BaseRepository } from './base/BaseRepository';
import { Pet } from '../models/Pet';
import { Repository } from '../../decorators/Repository';

@Repository(Pet)
export class PetRepository extends BaseRepository<Pet> {

  /**
   * Find by user_id is used for our data-loader to get all needed pets in one query.
   */
  public async findByUserIds(ids: string[]): Promise<Pet[] | undefined> {
    return undefined;
  }

}
