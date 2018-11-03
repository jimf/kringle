if exists("b:current_syntax")
  finish
endif

" Keywords
syn keyword kringleStatement assert break return
syn keyword kringleStatement fn nextgroup=kringleFunction skipwhite
syn match kringleFunction "[a-zA-Z][a-zA-Z0-9]*" display contained
syn keyword kringleRepeat for
syn keyword kringleConditional if elif else then while
syn keyword kringleOperator in notin
syn match kringleOperator /<<<\|<<\|>>>\|>>\|==\|<=\|>=\||>\|[-+*/^]=\|[-+*+=&~!|<>%^]/ skipwhite skipempty

" Comments
syn match kringleComment "#.*$" display contains=kringleTodo
syn keyword kringleTodo TODO FIXME XXX contained

" Strings
syn region kringleString start=+[bB]\='+ skip=+\\\\\|\\'\|\\$+ excludenl end=+'+ end=+$+ keepend
syn region kringleString start=+[bB]\="""+ end=+"""+ keepend

" Numbers
syn match kringleHexNumber "\<0[xX]\x\+[lL]\=\>" display
syn match kringleNumber "\<\d\+[lLjJ]\=\>" display

" Builtins
syn keyword kringleBoolean true false
syn keyword kringleBuiltinLiteral null Ø

syn sync match kringleSync grouphere NONE "^\%(fn\)\s\+\h\w*\s*[(:]"")]"

" Highlights
hi def link kringleBoolean Boolean
hi def link kringleBuiltinLiteral Structure
hi def link kringleComment Comment
hi def link kringleConditional Conditional
hi def link kringleFunction Function
hi def link kringleHexNumber Number
hi def link kringleNumber Number
hi def link kringleOperator Operator
hi def link kringleRepeat Repeat
hi def link kringleStatement Statement
hi def link kringleString String
