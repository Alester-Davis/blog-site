import Work from "../models/work.model.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createWork = catchAsync(async()=>{
    const {title,domain,startDate,endDate,content,techstack,role,websiteLink,typeOfWork,image,slug} = req.body;
    const work = await Work.create({
        title,
        domain,
        startDate,
        endDate,
        content,
        techstack,
        role,
        websiteLink,
        typeOfWork,
        image,
        slug
    })
    const res = await work.json();
    res.status(2000).json(res)
})


export const displayWorks = catchAsync(async (req, res, next) => {
    const works = await Work.findAll();

    res.status(200).json({
        status: 'success',
        results: works.length,
        data: {
            works,
        },
    });
});

export const displayWork = catchAsync(async (req, res, next) => {
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;
    const query = {
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.domain && { domain: req.query.domain }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.workId && { _id: req.query.workId }),
        ...(req.query.searchTerm && {
            $or: [
                { title: { $regex: req.query.searchTerm, $options: 'i' } },
                { content: { $regex: req.query.searchTerm, $options: 'i' } },
                { domain: { $regex: req.query.searchTerm, $options: 'i' } },
                { role: { $regex: req.query.searchTerm, $options: 'i' } }
            ],
        }),
    };

    const result = await Work.find(query)
        .sort({ updatedAt: sortDirection });

    const totalDoc = await Work.countDocuments(query);
    const now = new Date();
    const date = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    );
    const lastMonthDoc = await Work.countDocuments({
        ...query,
        createdAt: { $gte: date },
    });

    res.status(200).json({
        status: 'success',
        result,
        totalDoc,
        lastMonthDoc
    });
});

export const updateWork = catchAsync(async (req, res, next) => {
    const work = await Work.update(req.body, {
        where: { slug: req.params.slug },
        returning: true,
        plain: true,
    });

    if (!work[1]) {
        return next(new AppError('No work found with that slug', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            work: work[1],
        },
    });
});

export const deleteWork = catchAsync(async (req, res, next) => {
    const work = await Work.destroy({
        where: { slug: req.params.slug },
    });

    if (!work) {
        return next(new AppError('No work found with that slug', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

