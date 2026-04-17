import { request } from '@umijs/max';

export interface ExportTask {
  taskId: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  filePath?: string;
  errorMsg?: string;
}

/** 触发导出，返回 taskId */
export function triggerExport(filter?: { name?: string; email?: string }) {
  return request<{ taskId: string; message: string }>('/proxy/export/users', {
    method: 'POST',
    data: filter ?? {},
  });
}

/** 查询任务状态 */
export function getExportStatus(taskId: string) {
  return request<ExportTask>(`/proxy/export/status/${taskId}`, {
    method: 'GET',
  });
}

/** 下载文件 */
export function downloadExport(taskId: string) {
  window.open(`/proxy/export/download/${taskId}`);
}
