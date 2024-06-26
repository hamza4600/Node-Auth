import { TechService } from '@/services/teach.service';
import { CacheAPIWrapper } from './../cache/cache-api-wrapper.d';
import { PrismaClient, Prisma, TechnologyEntity } from '@prisma/client';
import { Container } from 'typedi';

type TechnologyEntityId = TechnologyEntity['id'];

export type TechnologyEntityCollectionPage = {
  totalCount: number;
  items: TechnologyEntity[];
};

export class TechnologyDataSource {
  constructor(private prismaClient: PrismaClient, private cacheAPIWrapper?: CacheAPIWrapper<TechnologyEntity>) {}

  public tech = Container.get(TechService);

  async getTechnologyById(id: TechnologyEntityId): Promise<TechnologyEntity | null> {
    let entity = await this.cacheAPIWrapper?.getCached(id);
    if (entity) {
      return entity;
    }
    entity = await this.prismaClient.technologyEntity.findFirst({
      where: {
        id,
      },
    });
    if (entity) {
      await this.cacheAPIWrapper?.cache(entity, 'id');
    }
    return entity;
  }

  async getTechnologies(limit: number, offset: number): Promise<TechnologyEntityCollectionPage> {
    const [totalCount, items] = await this.prismaClient.$transaction([
      this.prismaClient.technologyEntity.count(),
      this.prismaClient.technologyEntity.findMany({
        take: limit,
        skip: offset,
      }),
    ]);
    return {
      totalCount,
      items,
    };
  }

  async createTechnology(data: Prisma.TechnologyEntityCreateInput): Promise<TechnologyEntity> {
    const entity = await this.prismaClient.technologyEntity.create({
      data,
    });
    this.cacheAPIWrapper?.cache(entity, 'id');
    return entity;
  }

  async updateTechnology(id: TechnologyEntityId, updateTechnology: Prisma.TechnologyEntityUpdateInput): Promise<TechnologyEntity> {
    const entity = await this.prismaClient.technologyEntity.update({
      where: {
        id,
      },
      data: updateTechnology,
    });
    await this.cacheAPIWrapper?.cache(entity, 'id');
    return entity;
  }

  async deleteTechnology(id: TechnologyEntityId): Promise<TechnologyEntity> {
    const deleted = await this.prismaClient.technologyEntity.delete({
      where: {
        id,
      },
    });
    if (deleted) {
      await this.cacheAPIWrapper?.invalidateCached(id);
    }
    return deleted;
  }
}
