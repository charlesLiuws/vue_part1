const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  // aa-aa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;// aa：aa或者aa
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配{{}}
function createASTElement(tag,attrs){
    return {
        tag,
        type:1, //标签类型
        children:[],
        attrs,
        parent:null
    }
}
let root=null;
let currentParent;  //栈型结构管理所有的标签元素
let stack = [];
function parseHTML(html){
    // 根据开始标签、结束标签、文本内容生成ast语法树
    function start(tagName,attrs){
        let element = createASTElement(tagName,attrs);  //创建ast语法树
        if(!root){
            root=element;
        }
        currentParent=element; //暂存当前元素，便于关联父子关系
        stack.push(element);
        console.log('开始标签：'+tagName);
    }
    function end(tagName){
        let element=stack.pop();
        currentParent=stack[stack.length-1];
        if(currentParent){
            element.parent=currentParent;
            currentParent.children.push(element)
        }
        console.log('结束标签：'+tagName);
    }
    function chars(text){
        text = text.replace(/\s/g,' ');
        if(text){
            currentParent.children.push({
                type:3,
                text
            })
        }
        console.log('文本'+text)
    }
    //截取html前进
    function advance(n){html = html.substring(n);}
    function parseStarTag(){    //解析标签
        const start = html.match(startTagOpen);
        if(start){
            let match = {
                tagName:start[1],   //目标元素标签
                attrs:[]    //标签属性
            }
            advance(start[0].length);
            let end;let attr;
            while(!(end=html.match(startTagClose)) && (attr=html.match(attribute))){    //开始查找该元素的属性，直到遇到该元素的 > 停止
                advance(attr[0].length);
                match.attrs.push({name:attr[1],value:attr[3] || attr[4] || attr[5]})
            }
            if(end){    //删减 >
                advance(end[0].length);
                return match
            }
            // console.log(match,html);
        }
    }
    while(html){  //循环匹配html,不断截取删减
        let textEnd = html.indexOf('<');    
        if(textEnd == 0){   //以 < 开头,开始解析标签
            let startTagMatch=parseStarTag(); 
            if(startTagMatch){
                start(startTagMatch.tagName,startTagMatch.attrs)
                continue;
            }
            let endTagMatch = html.match(endTag);
            if(endTagMatch){    //匹配到的是结束（如</div>）标签时，则删减
                advance(endTagMatch[0].length);
                end(endTagMatch[0]);
                continue;
            }
        }
        let text;
        if(textEnd>0){  //不以 < 开头,开始解析文本
            text=html.substring(0,textEnd);
        }
        if(text){
            advance(text.length);chars(text);
        }
    }
}
export function compileToFunctions(template){
    console.log(template);
    parseHTML(template);
}