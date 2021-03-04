namespace Freakylay.UiElement {

    import Helper = Freakylay.Internal.Helper;

    export class Tutorial {

        private element: HTMLDivElement;
        private shown: boolean = false;

        constructor() {
            this.element = Helper.element<HTMLDivElement>('tutorial');

            let headline = Helper.create<HTMLHeadingElement>('h1');
            headline.innerHTML = 'Welcome to Freakylay!';

            let description = Helper.create<HTMLParamElement>('p');
            description.innerHTML = 'Hey there player! It looks like you started me for the first time because you gave me no options.<br>Don\'t worry, just let me ask you a simple question:';

            let question = Helper.create<HTMLParamElement>('p');
            question.innerHTML = 'Configure me now?';

            let skipButton = Helper.create<HTMLInputElement>('input');
            skipButton.type = 'button';
            skipButton.value = 'skip this shit';
            skipButton.onclick = () => {
                window.location.href = window.location.href + '?s';
            };

            let configButton = Helper.create<HTMLInputElement>('input');
            configButton.type = 'button';
            configButton.value = 'yes configure now!';
            configButton.onclick = () => {
                ui.toggleOptionPanel();
                Helper.display(this.element, false);
                this.shown = false;
            };

            let buttons = Helper.create<HTMLDivElement>('div');
            buttons.append(skipButton, configButton);

            let copyright = Helper.create<HTMLDivElement>('div');
            copyright.innerHTML = 'Freakylay 2.1.0 &copy; 2020 - 2021 by UnskilledFreak';
            Helper.addClass(copyright, 'copy')

            this.element.append(headline, description, question, buttons, copyright);
        }

        public show(): void {
            window.setTimeout(() => {
                Helper.addClass(this.element, 'show');
                this.shown = true;
            }, 250);
        }

        public isShown(): boolean {
            return this.shown;
        }
    }
}