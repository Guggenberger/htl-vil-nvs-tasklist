import { strictEqual } from'assert';

describe('Simple Tests', function () { 
    it('addition test', function () { 
        strictEqual(1 + 2, 3);     
    });
    
    it('subtraction test', function () {
         strictEqual(1 - 2, -1);     
    }); 
    
    it('multiply test', function () {
         strictEqual(2 * 2, 4);     
    }); 
}); 