import { CaseService } from '@/services/case.service';
import { CacheAPIWrapper } from './../cache/cache-api-wrapper.d';
import { PrismaClient, Prisma, Case } from '@prisma/client';
import { Container } from 'typedi';

type CaseEntityId = Case['caseId'];

type CacheableCase = {
    [K in keyof Case]: Case[K] extends Date ? string : Case[K];
  };
export type CaseEntityCollectionPage = {
  totalCount: number;
  items: Case[];
};

export class CaseDataSource {
    constructor(private prismaClient: PrismaClient, private cacheAPIWrapper?: CacheAPIWrapper<any>) {}

  public case = Container.get(CaseService);

  async getCaseById(id: CaseEntityId): Promise<Case | null> {
    let entity = await this.cacheAPIWrapper?.getCached(id);
    if (entity) {
      return entity;
    }
    entity = await this.prismaClient.case.findFirst({
      where: {
        caseId: id,
      },
    });
    if (entity) {
      await this.cacheAPIWrapper?.cache(entity, 'id');
    }
    return entity;
  }

  async getCases(limit: number, offset: number): Promise<CaseEntityCollectionPage> {
    const [totalCount, items] = await this.prismaClient.$transaction([
      this.prismaClient.case.count(),
      this.prismaClient.case.findMany({
        take: limit,
        skip: offset,
      }),
    ]);
    return {
      totalCount,
      items,
    };
  }
}
