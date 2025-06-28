import {describe, expect, it} from "vitest";
import {parse} from "node-html-parser";
import Parser from "../../../src/compiler/Parser.js";
import ParserNode from "../../../src/compiler/parser/ParserNode.js";
import ParserTextNode from "../../../src/compiler/parser/ParserTextNode.js";



describe("Whitespace tests", () => {
    it("Single span with additional tests", () => {
        
        const parsed = parse("<span>Text<span>")
        
        const rootElement = new Parser(parsed).parse()
        
        expect(rootElement.name).eq("#root")
        expect(rootElement.children).length(1)
        const firstChild = rootElement.children[0] as ParserNode
        expect(firstChild.name).eq("span")
        expect(firstChild).toBeInstanceOf(ParserNode)
        expect(firstChild.children).length(1)
        
        const nestedFirstChild = firstChild.children[0] as ParserTextNode
        
        expect(nestedFirstChild).toBeInstanceOf(ParserTextNode)
        expect(nestedFirstChild.value.segments).length(1)
        expect(nestedFirstChild.value.segments[0].content).eq("Text")
        expect(nestedFirstChild.value.segments[0].isExpression).eq(false)
        
    });
    
    it("Nested span", () => {
        
        const parsed = parse("<span> <span>Text A</span> <span>Text B</span>\n</span>")
        
        const rootElement = new Parser(parsed).parse().children[0] as ParserNode
        
        expect(rootElement.children).length(3)
        const firstChild = rootElement.children[0] as ParserNode
        expect(firstChild).toBeInstanceOf(ParserNode)
        expect(firstChild.children).length(1)
        
        expect(rootElement.children[0]).toBeInstanceOf(ParserNode)
        expect(rootElement.children[1]).toBeInstanceOf(ParserTextNode)
        expect(rootElement.children[2]).toBeInstanceOf(ParserNode)
        
    });
    
    it("Two spans with whitespace between", () => {
        
        const parsed = parse("<span>Text A</span>\n<span>Text B</span>")
        
        const rootElement = new Parser(parsed).parse()
        
        expect(rootElement.children).length(3)
        const firstChild = rootElement.children[0] as ParserNode
        expect(firstChild).toBeInstanceOf(ParserNode)
        expect(firstChild.children).length(1)
        
        expect(rootElement.children[0]).toBeInstanceOf(ParserNode)
        expect(rootElement.children[1]).toBeInstanceOf(ParserTextNode)
        expect(rootElement.children[2]).toBeInstanceOf(ParserNode)
        
        const textNode = rootElement.children[1] as ParserTextNode
        
        expect(textNode).toBeInstanceOf(ParserTextNode)
        expect(textNode.value.segments).length(1)
        expect(textNode.value.segments[0].content).eq(" ")
        expect(textNode.value.segments[0].isExpression).eq(false)
        
    });
    
    describe("xtm:whitespace", () => {
        
        it("P without whitespace", () => {
            
            const parsed = parse("<p>\nText\nText 2    \n Text 3</p>")
            
            const rootElement = new Parser(parsed).parse().children[0] as ParserNode
            
            expect(rootElement.children).length(1)
            const firstChild = rootElement.children[0] as ParserTextNode
            expect(firstChild).toBeInstanceOf(ParserTextNode)
            
            expect(firstChild.value.segments).length(1)
            expect(firstChild.value.segments[0].content).eq("Text Text 2 Text 3")
            expect(firstChild.value.segments[0].isExpression).eq(false)
            
        });
        it("P with collapse", () => {
            
            const parsed = parse("<p xtm:whitespace='collapse'>\nText\nText 2    \n Text 3</p>")
            
            const rootElement = new Parser(parsed).parse().children[0] as ParserNode
            
            expect(rootElement.children).length(1)
            const firstChild = rootElement.children[0] as ParserTextNode
            expect(firstChild).toBeInstanceOf(ParserTextNode)
            
            expect(firstChild.value.segments).length(1)
            expect(firstChild.value.segments[0].content).eq("Text Text 2 Text 3")
            expect(firstChild.value.segments[0].isExpression).eq(false)
            
        });
        it("P with linebreak", () => {
            
            const parsed = parse("<p xtm:whitespace='linebreak'>\nText\nText 2    \n Text 3</p>")
            
            const rootElement = new Parser(parsed).parse().children[0] as ParserNode
            
            expect(rootElement.children).length(1)
            const firstChild = rootElement.children[0] as ParserTextNode
            expect(firstChild).toBeInstanceOf(ParserTextNode)
            
            expect(firstChild.value.segments).length(1)
            expect(firstChild.value.segments[0].content).eq("Text\nText 2\nText 3")
            expect(firstChild.value.segments[0].isExpression).eq(false)
            
        });
        it("P with pre", () => {
            
            const parsed = parse("<p xtm:whitespace='pre'>\nText\nText 2    \n Text 3</p>")
            
            const rootElement = new Parser(parsed).parse().children[0] as ParserNode
            
            expect(rootElement.children).length(1)
            const firstChild = rootElement.children[0] as ParserTextNode
            expect(firstChild).toBeInstanceOf(ParserTextNode)
            
            expect(firstChild.value.segments).length(1)
            expect(firstChild.value.segments[0].content).eq("\nText\nText 2    \n Text 3")
            expect(firstChild.value.segments[0].isExpression).eq(false)
            
        });
    })
})