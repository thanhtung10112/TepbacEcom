import { MatPaginatorIntl } from '@angular/material';

const vietnamRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 của ${length}`; }
  
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} của ${length}`;
}

export function getVietnamPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl(); 
  paginatorIntl.itemsPerPageLabel = 'Hiển thị';
  paginatorIntl.nextPageLabel = 'Tới';
  paginatorIntl.previousPageLabel = 'Lùi';
  paginatorIntl.getRangeLabel = vietnamRangeLabel;
  return paginatorIntl;
}