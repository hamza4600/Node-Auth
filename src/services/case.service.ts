import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { ResponseModel } from '@/utils/responsemodel';

@Service()
export class CaseService {
  public case = new PrismaClient().case;
  public response = new ResponseModel<any>();

  public async findAllCase(): Promise<any> {
    const allCase: any[] = await this.case.findMany();
    this.response.setSuccessAndData(allCase, "Case fetched successfully");
    return this.response;
  }

  public async findCaseById(caseId: string): Promise<any> {
    const findCase: any = await this.case.findUnique({ where: { caseId: caseId } });
    this.response.setSuccessAndData(findCase, "Case fetched successfully");
    return this.response;
  }

}