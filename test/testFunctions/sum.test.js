const { reject } = require('bcrypt/promises');
const sum = require('../../testFunctions/sum');

test(' Add 5 + 3 to equal 8', () => {
    expect(sum(5, 3)).toBe(8);
})

test('Object assignment ', () => {
    const data = { fname: 'abuzar' }
    data['lname'] = 'shabab',
        expect(data).toStrictEqual({ fname: 'abuzar', lname: 'shabab' });
})

test('Adding positive numbers could not be zero', () => {
    for (let a = 1; a < 10; a++) {
        for (let b = 1; b < 10; b++) {
            expect(a + b).not.toBe(0);
        }
    }
})

test('But there is a stop in Christoph', () => {
    expect('Christoph').toMatch(/stop/)
})

test('The shopping list has milk on it', () => {
    const shoppingList = [
        'diapers',
        'kleenex',
        'trash bags',
        'paper towels',
        'milk',
    ];
    // test('should contain milk', () => {
    expect(shoppingList).toContain('milk');
    // })
    // test('should contain paper towels', () => {
    expect(new Set(shoppingList)).toContain('paper towels');
    // })
})

function compileAndroidCode() {
    throw new Error('You are using incompatible node version')
}

test('Compiling android goes as expected', () => {
    expect(() => compileAndroidCode()).toThrow();
    expect(() => compileAndroidCode()).toThrow(Error);
    expect(() => compileAndroidCode()).toThrow(/incompatible/)
    expect(() => compileAndroidCode()).toThrow(('You are using incompatible node version'))

})

test('data is peanut butter', done => {
    function fetchData(callback) {
        callback('peanut butter');
    }
    function callback(data) {
        try {
            expect(data).toBe('peanut butter')
            done()
        } catch (error) {
            done(error);
        }
    }
    fetchData(callback);
})

const getPeanutButter = () => {
    const peanutButter = new Promise((resolve, reject) => {
        resolve('peanut butter')
    })
    return peanutButter;
}



test('data is peanut butter using promise', () => {
    return getPeanutButter().then(data => {
        console.log(data)
        expect(data).toBe('peanut butter')
    })

})

const getMangoJuice = (ingredient) => {
    const mangoJuice = new Promise((resolve, reject) => {
        if (ingredient !== 'Mango') reject('Cannot produce juice')
        resolve(`${ingredient} Juice`);
    })
    return mangoJuice
}

test('Mango should produce only mango juice otherwise it should not produce Juice', () => {
    return getMangoJuice('Mango')
        .then(juice => {
            console.log(juice)
            expect(juice).toBe('Mango Juice');
        }).catch(err => {
            expect(err).toBe('Cannot produce juice');
        })
})

// Using then catch
test('It should reject other ingredient', () => {
    return getMangoJuice('')  // Issue testing
        .then(juice => {
            console.log(juice)
            expect(juice).toBe('Mango Juice');
        })
        .catch(err => {
            expect(err).toBe('Cannot produce juice');
        })
})
// using async await 
test('It should produce juice', async () => {
    const juice = await getMangoJuice('Mango');
    expect(juice).toBe('Mango Juice')
})

test('It should not produce juice', async () => {
    try {
        const juice = await getMangoJuice('Rabbit');
    } catch (error) {
        expect(error).rejects
        // .toBe('Cannot produce juice')
    }
})