import { CaseDataSource } from './../controllers/case.controller';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { PrismaClient, Case } from '@prisma/client';
import { CacheAPIWrapper, createCacheAPIWrapperAsync } from '@/cache';

export class CaseRoute implements Routes {
  public path = '/case';
  public router = Router();
  private prismaClient = new PrismaClient();
  private caseCacheAPIWrapper: CacheAPIWrapper<any> | undefined;

  constructor() {
    this.initializeCacheAPIWrapper();
    this.initializeRoutes();
  }

  private async initializeCacheAPIWrapper() {
    // Await the result of createCacheAPIWrapperAsync
    this.caseCacheAPIWrapper = await createCacheAPIWrapperAsync<any>('case');
  }

  private initializeRoutes() {
    const caseData = this.caseCacheAPIWrapper
      ? new CaseDataSource(this.prismaClient, this.caseCacheAPIWrapper)
      : new CaseDataSource(this.prismaClient);

    this.router.get(`${this.path}`, caseData.getCases.bind(caseData));
    this.router.get(`${this.path}/:id(\\d+)`, caseData.getCaseById.bind(caseData));
    // this.router.post(`${this.path}`, caseData.createCase.bind(caseData));
    // this.router.put(`${this.path}/:id(\\d+)`, caseData.updateCase.bind(caseData));
    // this.router.delete(`${this.path}/:id(\\d+)`, caseData.deleteCase.bind(caseData));
  }
}