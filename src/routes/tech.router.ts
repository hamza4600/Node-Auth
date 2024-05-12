import { Router } from 'express';
import { TechnologyDataSource } from '@/controllers/technology.controller';
import { Routes } from '@interfaces/routes.interface';
import { PrismaClient, TechnologyEntity } from '@prisma/client';
import { CacheAPIWrapper, createCacheAPIWrapperAsync } from '@/cache';

export class TechnologyRoute implements Routes {
  public path = '/tech';
  public router = Router();
  private prismaClient = new PrismaClient();
  private technologyCacheAPIWrapper: CacheAPIWrapper<TechnologyEntity> | undefined;

  constructor() {
    this.initializeCacheAPIWrapper();
    this.initializeRoutes();
  }

  private async initializeCacheAPIWrapper() {
    // Await the result of createCacheAPIWrapperAsync
    this.technologyCacheAPIWrapper = await createCacheAPIWrapperAsync<TechnologyEntity>('technology');
  }

  private initializeRoutes() {
    const tech = this.technologyCacheAPIWrapper
      ? new TechnologyDataSource(this.prismaClient, this.technologyCacheAPIWrapper)
      : new TechnologyDataSource(this.prismaClient);

    this.router.get(`${this.path}`, tech.getTechnologies.bind(tech));
    this.router.get(`${this.path}/:id(\\d+)`, tech.getTechnologyById.bind(tech));
    this.router.post(`${this.path}`, tech.createTechnology.bind(tech));
    this.router.put(`${this.path}/:id(\\d+)`, tech.updateTechnology.bind(tech));
    this.router.delete(`${this.path}/:id(\\d+)`, tech.deleteTechnology.bind(tech));
  }
}
