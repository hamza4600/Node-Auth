import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';

@Service()
export class TechService {
  public tech = new PrismaClient().technologyEntity;

  public async findAllTech(): Promise<any[]> {
    const allTech: any[] = await this.tech.findMany();
    return allTech;
  }

  public async findTechById(techId: number): Promise<any> {
    const findTech: any = await this.tech.findUnique({ where: { id: techId } });
    if (!findTech) throw new HttpException(409, "Tech doesn't exist");

    return findTech;
  }

  public async createTech(techData: any): Promise<any> {
    const findTech: any = await this.tech.findUnique({ where: { displayName: techData.name } });
    if (findTech) throw new HttpException(409, `This tech ${techData.name} already exists`);

    const createTechData: any = await this.tech.create({ data: { ...techData } });
    return createTechData;
  }

  public async updateTech(techId: number, techData: any): Promise<any> {
    const findTech: any = await this.tech.findUnique({ where: { id: techId } });
    if (!findTech) throw new HttpException(409, "Tech doesn't exist");

    const updateTechData = await this.tech.update({ where: { id: techId }, data: { ...techData } });
    return updateTechData;
  }

  public async deleteTech(techId: number): Promise<any> {
    const findTech: any = await this.tech.findUnique({ where: { id: techId } });
    if (!findTech) throw new HttpException(409, "Tech doesn't exist");

    const deleteTechData = await this.tech.delete({ where: { id: techId } });
    return deleteTechData;
  }
}
