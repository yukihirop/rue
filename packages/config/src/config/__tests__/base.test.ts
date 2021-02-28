import { Config$Base as Config } from '../base';

describe('Config$Base', () => {
  describe('static properties', () => {
    it('should correctly', () => {
      expect(Config.fileName).toEqual('rue.config.js');
      expect(Config.default).toEqual({
        cli: {
          commands: {
            console: {
              nodeREPL: {
                prompt: '🍛 > ',
                useColors: true,
              },
            },
          },
        },
        repl: {
          loadModules: [
            'src/**/{forms,models,records}/**/*.{js,ts}',
            '!src/**/__tests__/*.test.{js,ts}',
          ],
          moduleAliases: { '@': './src' },
        },
      });
      expect(Config.defaultJS).toMatchSnapshot();
    });
  });

  describe('all', () => {
    describe('when default', () => {
      it('should correctly', () => {
        expect(Config.all()).toEqual({
          cli: {
            commands: {
              console: {
                nodeREPL: {
                  prompt: '🍛 > ',
                  useColors: true,
                },
              },
            },
          },
          repl: {
            loadModules: [
              'src/**/{forms,models,records}/**/*.{js,ts}',
              '!src/**/__tests__/*.test.{js,ts}',
            ],
            moduleAliases: { '@': './src' },
          },
        });
      });
    });
  });

  describe('nodeREPL', () => {
    describe('when default', () => {
      it('should correctly', () => {
        expect(Config.nodeREPL()).toEqual({
          prompt: '🍛 > ',
          useColors: true,
        });
      });
    });
  });

  describe('rueREPL', () => {
    describe('when default', () => {
      it('should correctly', () => {
        expect(Config.rueREPL()).toEqual({
          loadModules: [
            'src/**/{forms,models,records}/**/*.{js,ts}',
            '!src/**/__tests__/*.test.{js,ts}',
          ],
          moduleAliases: { '@': './src' },
        });
      });
    });
  });
});
