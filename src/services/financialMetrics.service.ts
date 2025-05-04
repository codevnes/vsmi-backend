import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/error';

/**
 * Get all financial metrics with optional filters and pagination
 */
export const getFinancialMetrics = async (
  page = 1,
  limit = 20,
  symbol?: string,
  year?: number,
  quarter?: number
) => {
  const skip = (page - 1) * limit;
  
  // Build filter conditions
  const whereCondition: any = {};
  
  if (symbol) {
    whereCondition.symbol = symbol;
  }
  
  if (year) {
    whereCondition.year = year;
  }
  
  if (quarter !== undefined) {
    whereCondition.quarter = quarter;
  }
  
  // Execute query with pagination
  const [data, total] = await Promise.all([
    prisma.financialMetrics.findMany({
      where: whereCondition,
      orderBy: [
        { year: 'desc' },
        { quarter: 'desc' }
      ],
      skip,
      take: limit,
      include: {
        stock: {
          select: {
            name: true,
            exchange: true,
            industry: true,
          },
        },
      },
    }),
    prisma.financialMetrics.count({
      where: whereCondition,
    }),
  ]);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single financial metrics record by ID
 */
export const getFinancialMetricsById = async (id: string) => {
  const record = await prisma.financialMetrics.findUnique({
    where: { id },
    include: {
      stock: {
        select: {
          name: true,
          exchange: true,
          industry: true,
        },
      },
    },
  });
  
  if (!record) {
    throw new NotFoundError('Financial metrics record not found');
  }
  
  return record;
};

/**
 * Get financial metrics for a specific stock
 */
export const getFinancialMetricsBySymbol = async (
  symbol: string,
  page = 1,
  limit = 20,
  year?: number,
  quarter?: number
) => {
  // Check if stock exists
  const stock = await prisma.stock.findUnique({
    where: { symbol },
  });
  
  if (!stock) {
    throw new NotFoundError(`Stock with symbol ${symbol} not found`);
  }
  
  const skip = (page - 1) * limit;
  
  // Build filter conditions
  const whereCondition: any = {
    symbol,
  };
  
  if (year) {
    whereCondition.year = year;
  }
  
  if (quarter !== undefined) {
    whereCondition.quarter = quarter;
  }
  
  // Execute query with pagination
  const [records, total] = await Promise.all([
    prisma.financialMetrics.findMany({
      where: whereCondition,
      orderBy: [
        { year: 'desc' },
        { quarter: 'desc' }
      ],
      skip,
      take: limit,
    }),
    prisma.financialMetrics.count({
      where: whereCondition,
    }),
  ]);
  
  return {
    symbol,
    stockName: stock.name,
    records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Create a new financial metrics record
 */
export const createFinancialMetrics = async (data: {
  symbol: string;
  year: number;
  quarter?: number | null;
  eps?: number | null;
  epsIndustry?: number | null;
  pe?: number | null;
  peIndustry?: number | null;
  roa?: number | null;
  roe?: number | null;
  roaIndustry?: number | null;
  roeIndustry?: number | null;
  revenue?: number | null;
  margin?: number | null;
  totalDebtToEquity?: number | null;
  totalAssetsToEquity?: number | null;
}) => {
  // Check if stock exists
  const stock = await prisma.stock.findUnique({
    where: { symbol: data.symbol },
  });
  
  if (!stock) {
    throw new NotFoundError(`Stock with symbol ${data.symbol} not found`);
  }
  
  // Check if a record already exists for this symbol, year and quarter
  const existingRecord = await prisma.financialMetrics.findFirst({
    where: {
      symbol: data.symbol,
      year: data.year,
      quarter: data.quarter,
    },
  });
  
  if (existingRecord) {
    throw new BadRequestError(`Financial metrics record already exists for ${data.symbol} in year ${data.year}, quarter ${data.quarter}`);
  }
  
  // Create the record
  return prisma.financialMetrics.create({
    data,
    include: {
      stock: {
        select: {
          name: true,
          exchange: true,
          industry: true,
        },
      },
    },
  });
};

/**
 * Update an existing financial metrics record
 */
export const updateFinancialMetrics = async (
  id: string,
  data: {
    eps?: number | null;
    epsIndustry?: number | null;
    pe?: number | null;
    peIndustry?: number | null;
    roa?: number | null;
    roe?: number | null;
    roaIndustry?: number | null;
    roeIndustry?: number | null;
    revenue?: number | null;
    margin?: number | null;
    totalDebtToEquity?: number | null;
    totalAssetsToEquity?: number | null;
  }
) => {
  // Check if record exists
  const existingRecord = await prisma.financialMetrics.findUnique({
    where: { id },
  });
  
  if (!existingRecord) {
    throw new NotFoundError('Financial metrics record not found');
  }
  
  // Update the record
  return prisma.financialMetrics.update({
    where: { id },
    data,
    include: {
      stock: {
        select: {
          name: true,
          exchange: true,
          industry: true,
        },
      },
    },
  });
};

/**
 * Delete a financial metrics record
 */
export const deleteFinancialMetrics = async (id: string) => {
  // Check if record exists
  const existingRecord = await prisma.financialMetrics.findUnique({
    where: { id },
  });
  
  if (!existingRecord) {
    throw new NotFoundError('Financial metrics record not found');
  }
  
  // Delete the record
  await prisma.financialMetrics.delete({
    where: { id },
  });
  
  return { id };
};

/**
 * Financial metrics import job interface
 */
export interface FinancialMetricsJobResult {
  jobId: string;
  totalRecords: number;
  processedRecords?: number;
  progress?: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  created?: number;
  skipped?: number;
  errors?: Array<{ symbol: string; year: number; quarter?: number | null; error: string }>;
}

// In-memory job storage (in production, use Redis or a database)
const financialMetricsJobs = new Map<string, {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  data: Array<{
    symbol: string;
    year: number;
    quarter?: number | null;
    eps?: number | null;
    epsIndustry?: number | null;
    pe?: number | null;
    peIndustry?: number | null;
    roa?: number | null;
    roe?: number | null;
    roaIndustry?: number | null;
    roeIndustry?: number | null;
    revenue?: number | null;
    margin?: number | null;
    totalDebtToEquity?: number | null;
    totalAssetsToEquity?: number | null;
  }>;
  totalRecords: number;
  processedRecords: number;
  created: number;
  skipped: number;
  errors: Array<{ symbol: string; year: number; quarter?: number | null; error: string }>;
}>();

/**
 * Create a job for bulk import of financial metrics
 */
export const createFinancialMetricsImportJob = async (
  metrics: Array<{
    symbol: string;
    year: number;
    quarter?: number | null;
    eps?: number | null;
    epsIndustry?: number | null;
    pe?: number | null;
    peIndustry?: number | null;
    roa?: number | null;
    roe?: number | null;
    roaIndustry?: number | null;
    roeIndustry?: number | null;
    revenue?: number | null;
    margin?: number | null;
    totalDebtToEquity?: number | null;
    totalAssetsToEquity?: number | null;
  }>
): Promise<FinancialMetricsJobResult> => {
  if (!metrics.length) {
    throw new BadRequestError('No financial metrics records provided');
  }
  
  // Validate stock symbols first
  const stockSymbols = [...new Set(metrics.map(m => m.symbol))];
  const existingStocks = await prisma.stock.findMany({
    where: {
      symbol: {
        in: stockSymbols,
      },
    },
    select: {
      symbol: true,
    },
  });
  
  const existingStockSymbols = existingStocks.map(s => s.symbol);
  const missingStocks = stockSymbols.filter(s => !existingStockSymbols.includes(s));
  
  if (missingStocks.length) {
    throw new NotFoundError(`Some stocks were not found: ${missingStocks.join(', ')}`);
  }
  
  // Create a job ID
  const jobId = `fm-job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Store job in memory
  financialMetricsJobs.set(jobId, {
    status: 'queued',
    data: metrics,
    totalRecords: metrics.length,
    processedRecords: 0,
    created: 0,
    skipped: 0,
    errors: []
  });
  
  // Start the job in the background
  setTimeout(() => processFinancialMetricsJob(jobId), 0);
  
  return {
    jobId,
    totalRecords: metrics.length,
    processedRecords: 0,
    progress: 0,
    status: 'queued',
    created: 0,
    skipped: 0,
    errors: []
  };
};

/**
 * Process a financial metrics import job in the background
 */
const processFinancialMetricsJob = async (jobId: string): Promise<void> => {
  const job = financialMetricsJobs.get(jobId);
  if (!job) return;
  
  try {
    // Update job status
    job.status = 'processing';
    job.processedRecords = 0;
    financialMetricsJobs.set(jobId, job);
    
    const BATCH_SIZE = 100;
    const totalRecords = job.data.length;
    
    // Process in batches
    for (let i = 0; i < job.data.length; i += BATCH_SIZE) {
      const batch = job.data.slice(i, i + BATCH_SIZE);
      
      for (const metric of batch) {
        try {
          // Check if record already exists
          const existingRecord = await prisma.financialMetrics.findFirst({
            where: {
              symbol: metric.symbol,
              year: metric.year,
              quarter: metric.quarter,
            },
          });
          
          if (existingRecord) {
            job.skipped++;
            job.processedRecords++;
            continue;
          }
          
          // Create the record
          await prisma.financialMetrics.create({
            data: metric,
          });
          
          job.created++;
          job.processedRecords++;
        } catch (error) {
          job.errors.push({
            symbol: metric.symbol,
            year: metric.year,
            quarter: metric.quarter,
            error: error instanceof Error ? error.message : String(error),
          });
          job.processedRecords++;
        }
      }
      
      // Update job status after each batch
      financialMetricsJobs.set(jobId, job);
      
      // Log progress for large jobs
      if (totalRecords > BATCH_SIZE) {
        const progressPercent = Math.min(Math.floor((job.processedRecords / totalRecords) * 100), 100);
        console.log(`Job ${jobId}: ${progressPercent}% complete (${job.processedRecords}/${totalRecords} records)`);
      }
      
      // Add small delay between batches to prevent resource exhaustion
      if (i + BATCH_SIZE < job.data.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Update job status to completed
    job.status = 'completed';
    financialMetricsJobs.set(jobId, job);
    
    // Clean up job data to save memory (keep metadata)
    const updatedJob = financialMetricsJobs.get(jobId);
    if (updatedJob) {
      updatedJob.data = [];
      financialMetricsJobs.set(jobId, updatedJob);
    }
    
  } catch (error) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during processing';
    console.error(`Job ${jobId} failed:`, errorMessage);
    
    job.status = 'failed';
    financialMetricsJobs.set(jobId, job);
  }
};

/**
 * Get the status of a financial metrics import job
 */
export const getFinancialMetricsJobStatus = (jobId: string): FinancialMetricsJobResult | null => {
  const job = financialMetricsJobs.get(jobId);
  if (!job) return null;
  
  // Calculate progress percentage
  const progress = job.totalRecords > 0 
    ? Math.min(Math.floor((job.processedRecords / job.totalRecords) * 100), 100)
    : 0;
    
  return {
    jobId,
    totalRecords: job.totalRecords,
    processedRecords: job.processedRecords,
    progress,
    status: job.status,
    created: job.created,
    skipped: job.skipped,
    errors: job.errors
  };
};

/**
 * Get financial metrics reports by year or quarter for a specific stock
 */
export const getFinancialMetricsReports = async (
  symbol: string,
  type: string,
  page = 1,
  limit = 20
) => {
  // Check if stock exists
  const stock = await prisma.stock.findUnique({
    where: { symbol },
  });
  
  if (!stock) {
    throw new NotFoundError(`Stock with symbol ${symbol} not found`);
  }
  
  const skip = (page - 1) * limit;
  
  // Build filter conditions based on report type
  const whereCondition: any = {
    symbol,
  };
  
  if (type === 'year') {
    whereCondition.quarter = null;
  } else if (type === 'quarter') {
    whereCondition.quarter = {
      not: null
    };
  } else {
    throw new BadRequestError('Report type must be either "year" or "quarter"');
  }
  
  // Execute query with pagination
  const [records, total] = await Promise.all([
    prisma.financialMetrics.findMany({
      where: whereCondition,
      orderBy: type === 'quarter' 
        ? [{ year: 'desc' }, { quarter: 'desc' }] 
        : [{ year: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.financialMetrics.count({
      where: whereCondition,
    }),
  ]);
  
  return {
    symbol,
    stockName: stock.name,
    type,
    records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Delete all financial metrics data
 */
export const deleteAllFinancialMetrics = async () => {
  // Perform delete all operation
  const result = await prisma.financialMetrics.deleteMany({});
  
  return {
    deleted: result.count,
    message: `Deleted ${result.count} financial metrics records`
  };
};

/**
 * Bulk import financial metrics
 */
export const bulkImportFinancialMetrics = async (
  metrics: Array<{
    symbol: string;
    year: number;
    quarter?: number | null;
    eps?: number | null;
    epsIndustry?: number | null;
    pe?: number | null;
    peIndustry?: number | null;
    roa?: number | null;
    roe?: number | null;
    roaIndustry?: number | null;
    roeIndustry?: number | null;
    revenue?: number | null;
    margin?: number | null;
    totalDebtToEquity?: number | null;
    totalAssetsToEquity?: number | null;
  }>
) => {
  if (!metrics.length) {
    throw new BadRequestError('No financial metrics records provided');
  }
  
  // Validate all records first
  const stockSymbols = [...new Set(metrics.map(m => m.symbol))];
  const existingStocks = await prisma.stock.findMany({
    where: {
      symbol: {
        in: stockSymbols,
      },
    },
    select: {
      symbol: true,
    },
  });
  
  const existingStockSymbols = existingStocks.map(s => s.symbol);
  const missingStocks = stockSymbols.filter(s => !existingStockSymbols.includes(s));
  
  if (missingStocks.length) {
    throw new NotFoundError(`Some stocks were not found: ${missingStocks.join(', ')}`);
  }
  
  // Process each record
  const results = {
    created: 0,
    skipped: 0,
    errors: [] as Array<{ symbol: string; year: number; quarter?: number | null; error: string }>,
  };
  
  for (const metric of metrics) {
    try {
      // Check if record already exists
      const existingRecord = await prisma.financialMetrics.findFirst({
        where: {
          symbol: metric.symbol,
          year: metric.year,
          quarter: metric.quarter,
        },
      });
      
      if (existingRecord) {
        results.skipped++;
        continue;
      }
      
      // Create the record
      await prisma.financialMetrics.create({
        data: metric,
      });
      
      results.created++;
    } catch (error) {
      results.errors.push({
        symbol: metric.symbol,
        year: metric.year,
        quarter: metric.quarter,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  
  return results;
};

export const getFinancialMetricsForStock = async (symbol: string, year?: number, quarter?: number) => {
  // ... existing code ...
}; 