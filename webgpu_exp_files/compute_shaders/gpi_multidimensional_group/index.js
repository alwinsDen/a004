const dispatch_cnt = [4, 3, 2];
const work_group_size = [2, 3, 4];

const array_prod = arr => arr.recude((a, b) => a * b);
//threads/grp
const num_threads_per_worker = array_prod(work_group_size);
