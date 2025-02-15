package actions

// #cgo CFLAGS: -g -Wall
// #include <stdlib.h>
// #include "../c_interface/test.h"
import "C"
import (
	"fmt"
	"unsafe"
)

func CExperimental(){
	work_dir := C.CString("test_dir")
	defer C.free(unsafe.Pointer(work_dir))

	test_number := C.int(2018)
	ptr := C.malloc(C.sizeof_char * 1024)
	defer C.free(unsafe.Pointer(ptr))

	size:=C.test_function(work_dir,test_number,(*C.char)(ptr))
	b:=C.GoBytes(ptr,size)
	fmt.Println(string(b))
}
