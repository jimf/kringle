if exists('b:loaded_kringle')
  finish
endif
let b:loaded_kringle = 1

setlocal formatoptions-=t formatoptions+=croql
setlocal comments=:##,:#
setlocal commentstring=#\ %s
setlocal suffixesadd=.nim
setlocal expandtab
setlocal foldmethod=indent
setlocal tabstop=2
setlocal softtabstop=2
setlocal shiftwidth=2
