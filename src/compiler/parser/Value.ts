export class ValueSegment {
    constructor(
        public isExpression: boolean,
        public content: string,
    ) {}
    
    escaped() {
        let escaped = this.content;
        
        escaped = escaped.replace(/\n/g, "\\n");
        escaped = escaped.replace(/"/g, '\\"')
        
        return escaped
    }
    
    toString() {
        const textValue = this.escaped()
        if (!this.isExpression) {
            return `"${textValue}"`;
        }
        
        return `api.createExpression("${textValue}")`
    }
}

export default class Value {
    public segments: ValueSegment[] = [];

    constructor(text: string) {
        let index = 0;
        let lastIndex = 0;
        
        if (text.length === 0) {
            this.segments.push(new ValueSegment(false, ''));
            return
        }

        while ((index = text.indexOf("{{", index)) !== -1) {
            const startIndex = index;
            index = text.indexOf("}}", index);

            if (index === -1) {
                break;
            }

            if (lastIndex !== startIndex) {
                this.segments.push(new ValueSegment(false, text.substring(lastIndex, startIndex)));
            }

            lastIndex = index + 2;

            this.segments.push(new ValueSegment(true, text.substring(startIndex + 2, index).trim()));
        }

        if (lastIndex < text.length) {
            this.segments.push(new ValueSegment(false, text.substring(lastIndex)));
        }
    }
    
    isSimpleString() {
        return this.segments.length === 1 && !this.segments[0].isExpression
    }
    
    asArray() {
        return this.segments.map(segment => segment.toString());
    }
    
    asTemplateString() {
        const string = this.segments.map(segment => {
            if (segment.isExpression) {
                return `\${${segment.toString()}}`
            }
            
            return segment.escaped()
        }).join('');
        
        return `\`${string}\``
    }

    toJSON() {
        return (
            "Value<" + this.segments.map((value) => `${value.isExpression ? "e" : "t"}[${value.content}]`).join() + ">"
        );
    }
}
