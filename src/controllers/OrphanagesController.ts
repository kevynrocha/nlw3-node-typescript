import { Response, Request, Express } from 'express';
import { getRepository } from 'typeorm';

import orphanageView from '../views/orphanages_views';
import Orphanage from '../models/Orphanage';

export default {
  async index(req: Request, res: Response) {
    const orphanagesRepository = getRepository(Orphanage);

    const orphanages = await orphanagesRepository.find({
      relations: ['images'],
    });

    return res.status(200).json(orphanageView.renderMany(orphanages));
  },
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const orphanagesRepository = getRepository(Orphanage);

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images'],
    });

    return res.status(200).json(orphanageView.render(orphanage));
  },

  async create(req: Request, res: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = req.body;

    const orphanagesRepository = getRepository(Orphanage);

    const requestImages = req.files as Express.Multer.File[];
    const images = requestImages.map((image) => {
      return {
        path: image.filename,
      };
    });

    const orphanage = orphanagesRepository.create({
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images,
    });

    await orphanagesRepository.save(orphanage);

    return res.status(201).json(orphanage);
  },
};
