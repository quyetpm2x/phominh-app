import { useMutation } from '@tanstack/react-query';

import { createReport, type CreateReportInput } from '../api/endpoints/reports';

export function useCreateReport() {
  return useMutation({
    mutationFn: (input: CreateReportInput) => createReport(input),
  });
}
