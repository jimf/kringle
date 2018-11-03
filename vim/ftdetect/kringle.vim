if has("autocmd")
  au BufNewFile,BufRead *.kk set filetype=kringle syntax=kringle | runtime! ftplugin/kringle.vim ftplugin/kringle*.vim ftplugin/kringle/*.vim
endif
