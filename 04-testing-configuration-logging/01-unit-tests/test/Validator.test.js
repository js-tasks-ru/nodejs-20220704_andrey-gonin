const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('валидатор проверяет строковые поля', () => {
      it('длина строки меньше min', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({ name: 'Lalala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });
      it('длина строки больше max', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 5,
            max: 7,
          },
        });

        const errors = validator.validate({ name: 'Lalalala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 7, got 8');
      });
      it('длина строки вписывается в рамки', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 5,
            max: 7,
          },
        });

        const errors = validator.validate({ name: 'Lalala' });

        expect(errors).to.have.length(0);
      });
    });


    describe('валидатор проверяет числовые поля', () => {
      it('число меньше min', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({ age: 5 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 5');
      });
      it('число больше max', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({ age: 21 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 21');
      });
      it('число вписывается в рамки', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({ age: 15 });

        expect(errors).to.have.length(0);
      });
      it('проверка на NaN', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({ age: NaN });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got NaN');
      });
    });

    it('проверяем тип данных', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ age: '5' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });
  });
});
