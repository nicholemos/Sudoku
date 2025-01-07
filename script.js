document.addEventListener('DOMContentLoaded', function () {
    // Função para gerar um tabuleiro completo de Sudoku
    function gerarTabuleiroCompleto() {
        const tabuleiro = Array(9).fill(null).map(() => Array(9).fill(0));

        function podeColocar(tabuleiro, linha, coluna, num) {
            for (let i = 0; i < 9; i++) {
                if (tabuleiro[linha][i] === num) return false;
            }
            for (let i = 0; i < 9; i++) {
                if (tabuleiro[i][coluna] === num) return false;
            }
            const startRow = Math.floor(linha / 3) * 3;
            const startCol = Math.floor(coluna / 3) * 3;
            for (let i = startRow; i < startRow + 3; i++) {
                for (let j = startCol; j < startCol + 3; j++) {
                    if (tabuleiro[i][j] === num) return false;
                }
            }
            return true;
        }

        function preencherTabuleiro(tabuleiro) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (tabuleiro[i][j] === 0) {
                        const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                        while (numeros.length > 0) {
                            const num = numeros.splice(Math.floor(Math.random() * numeros.length), 1)[0];
                            if (podeColocar(tabuleiro, i, j, num)) {
                                tabuleiro[i][j] = num;
                                if (preencherTabuleiro(tabuleiro)) return true;
                                tabuleiro[i][j] = 0;
                            }
                        }
                        return false; 
                    }
                }
            }
            return true; 
        }

        preencherTabuleiro(tabuleiro);
        return tabuleiro;
    }

    function criarSudoku(tabuleiroCompleto, dificuldades = 40) {
        const tabuleiro = tabuleiroCompleto.map(linha => [...linha]); 

        let tentativas = dificuldades;

        while (tentativas > 0) {
            const linha = Math.floor(Math.random() * 9);
            const coluna = Math.floor(Math.random() * 9);

            if (tabuleiro[linha][coluna] !== 0) {
                tabuleiro[linha][coluna] = 0;
                tentativas--;
            }
        }

        return tabuleiro;
    }

    // Função para gerar o tabuleiro e exibi-lo
    function gerarTabuleiro() {
        const tabuleiroCompleto = gerarTabuleiroCompleto();
        const tabuleiro = criarSudoku(tabuleiroCompleto);

        const boardElement = document.getElementById("board");
        const numberCountsElement = document.getElementById("number-counts");
        const victoryMessage = document.getElementById("victory-message");
        const defeatMessage = document.getElementById("defeat-message");

        boardElement.innerHTML = ''; 
        numberCountsElement.innerHTML = ''; 

        // Criação do tabuleiro com os números fixos e as células editáveis
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('input');
                cell.type = 'number';
                cell.min = '1';
                cell.max = '9';
                cell.value = tabuleiro[i][j] !== 0 ? tabuleiro[i][j] : '';
                
                if (tabuleiro[i][j] !== 0) {
                    cell.disabled = true; 
                }

                cell.dataset.row = i;
                cell.dataset.col = j;

                // Adiciona evento de input para cada célula
                cell.addEventListener('input', function (e) {
                    atualizarContadores(); // Atualiza os contadores sempre que houver alteração
                    verificarVitoria(tabuleiro, victoryMessage, defeatMessage); // Verifica vitória após cada jogada
                });

                // Adiciona evento de hover para destacar números iguais
                cell.addEventListener('mouseenter', function () {
                    destacarNumeros(cell.value);
                });
                cell.addEventListener('mouseleave', function () {
                    removerDestaques();
                });

                boardElement.appendChild(cell);
            }
        }

        // Atualizar os contadores de números faltantes
        atualizarContadores();
    }

    // Função para contar as ocorrências de cada número no tabuleiro (fixos e digitados)
    function contarNumerosEmTela() {
        const board = document.querySelectorAll('#board input');
        const contadorFaltantes = Array(9).fill(9); // Começa com 9 para cada número (máximo permitido)

        board.forEach(cell => {
            const valor = parseInt(cell.value);
            if (valor >= 1 && valor <= 9) {
                contadorFaltantes[valor - 1]--; // Diminui o contador para esse número
            }
        });

        return contadorFaltantes;
    }

    // Função para atualizar os contadores de números faltantes
    function atualizarContadores() {
        const contadorFaltantes = contarNumerosEmTela();
        const numberCountsElement = document.getElementById("number-counts");
        numberCountsElement.innerHTML = ''; // Limpa os contadores anteriores

        // Exibe os contadores de números faltantes
        for (let i = 0; i < 9; i++) {
            const div = document.createElement('div');
            div.classList.add('number-count');
            div.textContent = `${i + 1}: ${contadorFaltantes[i]} faltando`;

            // Adiciona evento de hover nos números do contador
            div.addEventListener('mouseenter', function () {
                destacarNumeros(i + 1);
            });
            div.addEventListener('mouseleave', function () {
                removerDestaques();
            });

            numberCountsElement.appendChild(div);
        }
    }

    // Função para destacar todos os números iguais no tabuleiro
    function destacarNumeros(valor) {
        const cells = document.querySelectorAll('#board input');
        cells.forEach(cell => {
            if (parseInt(cell.value) === valor) {
                cell.classList.add('highlight');
            }
        });
    }

    // Função para remover todos os destaques
    function removerDestaques() {
        const cells = document.querySelectorAll('#board input');
        cells.forEach(cell => {
            cell.classList.remove('highlight');
        });
    }

    // Função para verificar se o tabuleiro está correto
    function verificarVitoria(tabuleiroCompleto, victoryMessage, defeatMessage) {
        const board = document.querySelectorAll('#board input');
        let venceu = true;
        
        board.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (parseInt(cell.value) !== tabuleiroCompleto[row][col]) {
                venceu = false;
            }
        });

        if (venceu) {
            victoryMessage.style.display = 'block';
            defeatMessage.style.display = 'none';
        } else {
            victoryMessage.style.display = 'none';
            defeatMessage.style.display = 'none';
        }
    }

    // Adicionar a funcionalidade para o botão "Novo Tabuleiro"
    const newBoardButton = document.getElementById("new-board-button");
    newBoardButton.addEventListener('click', function () {
        gerarTabuleiro(); // Regenerar o tabuleiro ao clicar no botão
    });

    // Iniciar o jogo chamando gerarTabuleiro
    gerarTabuleiro();
});
