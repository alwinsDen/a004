#include "test.h"
#include <stdio.h>

int test_function(const char *work_dir,int test_number,char* out){
    int n;
    n=sprintf(out,"test_function called with work_dir=%s, test_number=%d\n",work_dir,test_number);
    return n;
}